#pragma once

#include <Client.h>
#include <PicoWebsocket.h>
#include "persistence.hpp"
#include <ArduinoJson.h>
#include "display.hpp"
#include "keypad.hpp"
class NFC; // Forward declaration instead of #include "nfc.hpp"

#define API_WS_PATH "/api/fabreader/websocket"

class API
{
public:
    API(Client &client, Display *display, Keypad *keypad) : websocket(client, API_WS_PATH), client(client), display(display), keypad(keypad) {}
    ~API() {}

    void setup(NFC *nfc);
    void loop();

    void sendNFCTapped(uint8_t *uid, uint8_t uidLength);

private:
    PicoWebsocket::Client websocket;
    Client &client;
    NFC *nfc;
    Display *display;
    Keypad *keypad;

    bool isConnected();
    void processData();
    bool checkTCPConnection();

    bool is_connected = false;
    bool is_authenticated = false;

    unsigned long registration_sent_at = 0;
    unsigned long authentication_sent_at = 0;
    unsigned long heartbeat_sent_at = 0;

    void sendRegistrationRequest();
    void sendAuthenticationRequest();

    bool isRegistered();
    bool isAuthenticated();

    void sendMessage(bool is_response, const char *type, JsonObject payload);
    void sendHeartbeat();

    void onRegistrationData(JsonObject data);
    void onDisplayText(JsonObject data);
    void onUnauthorized(JsonObject data);
    void onEnableCardChecking(JsonObject data);
    void onDisableCardChecking(JsonObject data);
    void onChangeKeys(JsonObject data);
    void onAuthenticate(JsonObject data);
    void onReauthenticate(JsonObject data);
    void onShowText(JsonObject data);

    void hexStringToBytes(const String &hexString, uint8_t *byteArray, size_t byteArrayLength);
};
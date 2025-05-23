#pragma once

#include <Arduino.h>

const unsigned char icon_api_connected[] PROGMEM = {
    0x00, 0x00, 0x03, 0xe0, 0x06, 0x60, 0x05, 0xa0, 0x05, 0x80, 0x06, 0xc0, 0x06, 0xc0, 0x06, 0x60,
    0x06, 0x7c, 0x4c, 0x0e, 0x58, 0xf6, 0x5b, 0xfa, 0x67, 0x06, 0x7e, 0x1e, 0x3c, 0x1c, 0x00, 0x00};

const unsigned char icon_api_disconnected[] PROGMEM = {
    0x00, 0x00, 0xe3, 0xe0, 0x76, 0x60, 0x39, 0xa0, 0x1d, 0x80, 0x0e, 0x80, 0x07, 0x00, 0x07, 0x80,
    0x05, 0xcc, 0x4c, 0xee, 0x58, 0x72, 0x5b, 0xfa, 0x67, 0x1c, 0x7e, 0x1e, 0x1c, 0x1f, 0x00, 0x00};

const unsigned char icon_wifi_off[] PROGMEM = {
    0x00, 0x00, 0xe0, 0x00, 0x70, 0x00, 0x3b, 0xf8, 0x3c, 0x3c, 0x6e, 0x06, 0x47, 0x02, 0x1f, 0xb8,
    0x39, 0xdc, 0x13, 0xe8, 0x07, 0xf0, 0x04, 0x38, 0x00, 0x1c, 0x01, 0x8e, 0x00, 0x07, 0x00, 0x00};

const unsigned char icon_wifi_on[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0xf8, 0x3d, 0x3c, 0x60, 0x06, 0x47, 0xe2, 0x1f, 0xf8,
    0x38, 0x1c, 0x13, 0xc8, 0x07, 0xe0, 0x04, 0x20, 0x00, 0x00, 0x01, 0x80, 0x00, 0x00, 0x00, 0x00};

const unsigned char icon_nfc_tap[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00,
    0x00, 0x38, 0x00, 0x00, 0x00, 0x00, 0x1c, 0x00, 0x00, 0x71, 0x00, 0x00, 0x00, 0x00, 0x9e, 0x00,
    0x00, 0x73, 0x80, 0x00, 0x00, 0x01, 0xce, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x00, 0xee, 0x00,
    0x00, 0xe7, 0x30, 0x00, 0x00, 0x0c, 0xe7, 0x00, 0x00, 0xe6, 0x71, 0x1b, 0xe7, 0x8e, 0x67, 0x00,
    0x00, 0xee, 0x71, 0x9a, 0x0c, 0xce, 0x77, 0x00, 0x00, 0xee, 0x61, 0xda, 0x18, 0x06, 0x77, 0x00,
    0x00, 0xce, 0x61, 0x5b, 0xd8, 0x06, 0x73, 0x00, 0x00, 0xce, 0x61, 0x7a, 0x58, 0x06, 0x73, 0x00,
    0x00, 0xee, 0x61, 0x3a, 0x18, 0xc6, 0x77, 0x00, 0x00, 0xee, 0x71, 0x1a, 0x0f, 0x8e, 0x77, 0x00,
    0x00, 0xe6, 0x70, 0x00, 0x03, 0x0e, 0x67, 0x00, 0x00, 0xe7, 0x30, 0x00, 0x00, 0x0c, 0xe7, 0x00,
    0x00, 0x77, 0x00, 0x00, 0x00, 0x00, 0xee, 0x00, 0x00, 0x73, 0x80, 0x00, 0x00, 0x01, 0xce, 0x00,
    0x00, 0x79, 0x00, 0x00, 0x00, 0x00, 0x8e, 0x00, 0x00, 0x38, 0x00, 0x00, 0x00, 0x00, 0x1c, 0x00,
    0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

const unsigned char icon_boot_logo[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x04, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0xe0, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x0f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0xd8, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x0f, 0xcc, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0xcc,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0xe4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x0c, 0x66, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x36, 0x00, 0x00,
    0x3e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x16, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x06, 0x00, 0x00, 0xc0, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x18, 0x07, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x03,
    0x00, 0x08, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x03, 0x00, 0x20, 0x08, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x10, 0x03, 0x80, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x03, 0xe0, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x03, 0xf4, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00,
    0x10, 0x07, 0xf8, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x18, 0x07, 0xe0, 0x08, 0x40, 0x00,
    0x10, 0x10, 0x00, 0x00, 0x18, 0x07, 0xc0, 0x18, 0x60, 0x00, 0x10, 0x30, 0x00, 0x00, 0x18, 0x07,
    0x80, 0x18, 0xe0, 0x00, 0x10, 0x30, 0x00, 0x00, 0x18, 0x07, 0x0f, 0xbc, 0xe7, 0xcf, 0x93, 0x79,
    0xf3, 0xf0, 0x04, 0x0e, 0x08, 0x98, 0xc6, 0x48, 0x92, 0x31, 0x13, 0x30, 0x06, 0x0e, 0x00, 0x98,
    0xc4, 0x40, 0x92, 0x31, 0x13, 0x30, 0x02, 0x0c, 0x01, 0x98, 0x44, 0x01, 0x9c, 0x31, 0x13, 0x00,
    0x03, 0x9c, 0x0f, 0x98, 0x44, 0x0f, 0x9c, 0x31, 0x13, 0x00, 0x01, 0x9c, 0x08, 0x98, 0x44, 0x08,
    0x96, 0x31, 0x13, 0x00, 0x08, 0xfc, 0x08, 0xb8, 0x44, 0x08, 0x92, 0x31, 0x13, 0x00, 0x00, 0xfc,
    0x19, 0xd8, 0x64, 0x09, 0x93, 0x31, 0x93, 0x04, 0x00, 0x0c, 0x0f, 0x8c, 0x64, 0x0f, 0x91, 0x19,
    0xf3, 0x00, 0x00, 0x06, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x1c, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x20, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
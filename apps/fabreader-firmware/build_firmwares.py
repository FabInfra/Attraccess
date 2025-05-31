#!/usr/bin/env python3
import os
import json
import subprocess
import configparser
import glob

def main():
    # Load configuration
    config = configparser.ConfigParser()
    config.read('platformio.ini')
    
    # Get base version
    base_version = config['env']['base_version'].strip()
    print(f"Base version: {base_version}")
    
    # Find all environments
    environments = []
    for section in config.sections():
        if section.startswith('env:'):
            env_name = section[4:]  # Remove 'env:' prefix
            environments.append(env_name)
    
    print(f"Found environments: {environments}")
    
    # Create output directory
    output_dir = os.path.abspath("firmware_output")
    os.makedirs(output_dir, exist_ok=True)
    
    # Build each environment and create manifest
    firmware_info = []
    
    for env in environments:
        print(f"Building environment: {env}")
        
        # Get environment version - look in specific env section, fallback to env section, then default to "1"
        env_version = "1"  # Default fallback
        env_section = f'env:{env}'
        
        if env_section in config and 'env_version' in config[env_section]:
            env_version = config[env_section]['env_version'].strip()
        elif 'env' in config and 'env_version' in config['env']:
            # Fallback to global env_version if defined
            env_version = config['env']['env_version'].strip()
            
        full_version = f"{base_version}-{env_version}"
        print(f"  Version for {env}: {full_version}")
        
        # Build firmware
        subprocess.run(['platformio', 'run', '-e', env], check=True)
        
        # Create environment-specific directory
        env_dir = os.path.join(output_dir, env)
        os.makedirs(env_dir, exist_ok=True)
        
        # Copy firmware files
        firmware_path = f".pio/build/{env}/firmware.bin"
        bootloader_path = f".pio/build/{env}/bootloader.bin"
        partitions_path = f".pio/build/{env}/partitions.bin"
        
        # Skip if any file is missing
        if not (os.path.exists(firmware_path) and os.path.exists(bootloader_path) and os.path.exists(partitions_path)):
            print(f"Warning: Some files missing for {env}, skipping")
            continue
        
        # Copy files
        subprocess.run(['cp', firmware_path, os.path.join(env_dir, "firmware.bin")], check=True)
        subprocess.run(['cp', bootloader_path, os.path.join(env_dir, "bootloader.bin")], check=True)
        subprocess.run(['cp', partitions_path, os.path.join(env_dir, "partitions.bin")], check=True)
        
        # Create manifest
        manifest = {
            "name": f"FabReader-{env}",
            "version": full_version,
            "builds": [{
                "chipFamily": "ESP32",
                "parts": [
                    {"path": f"_fabreader_assets/{env}/bootloader.bin", "offset": 4096},
                    {"path": f"_fabreader_assets/{env}/partitions.bin", "offset": 32768},
                    {"path": f"_fabreader_assets/{env}/firmware.bin", "offset": 65536}
                ]
            }]
        }
        
        # Save manifest
        manifest_path = os.path.join(env_dir, "manifest.json")
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        # Add to firmware info
        firmware_info.append({
            "environment": env,
            "version": full_version,
            "manifest_path": f"_fabreader_assets/{env}/manifest.json"
        })
    
    # Create index.json
    index = {
        "firmwares": firmware_info
    }
    
    with open(os.path.join(output_dir, "index.json"), 'w') as f:
        json.dump(index, f, indent=2)
    
    print(f"Build completed. Output in {output_dir}")
    print(f"Total environments built: {len(firmware_info)}")

if __name__ == "__main__":
    main() 
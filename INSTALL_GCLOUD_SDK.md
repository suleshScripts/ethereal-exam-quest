# Install Google Cloud SDK

## Quick Installation

### Step 1: Download Installer

The installer should open automatically. If not, download from:
https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

### Step 2: Run Installer

1. Run the downloaded `GoogleCloudSDKInstaller.exe`
2. Click "Yes" to allow changes
3. Follow the installation wizard:
   - Click "Next"
   - Accept the terms
   - Choose installation location (default is fine)
   - Click "Install"

### Step 3: Complete Setup

After installation:
1. ✅ Check "Start Google Cloud SDK Shell"
2. ✅ Check "Run 'gcloud init'"
3. Click "Finish"

### Step 4: Initialize

A new window will open. Follow these steps:

1. **Login**:
   ```
   You must log in to continue. Would you like to log in (Y/n)? Y
   ```
   - Press `Y` and Enter
   - Browser will open
   - Login with your Google account (vitthalpandit500@gmail.com)
   - Click "Allow"

2. **Select Project**:
   ```
   Pick cloud project to use:
   [1] clinomatrix
   [2] Create a new project
   ```
   - Type `1` and press Enter (to use clinomatrix)

3. **Select Region** (optional):
   ```
   Do you want to configure a default Compute Region and Zone? (Y/n)? Y
   ```
   - Type `Y` and Enter
   - Select region closest to you (e.g., `asia-south1`)

### Step 5: Verify Installation

Open a NEW PowerShell window and run:
```bash
gcloud --version
```

You should see:
```
Google Cloud SDK 456.0.0
...
```

### Step 6: Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## After Installation

Once installed, come back and we'll deploy the backend!

## Troubleshooting

### Issue: "gcloud not recognized"
**Solution**: 
1. Close ALL PowerShell/terminal windows
2. Open a NEW PowerShell window
3. Try again

### Issue: "Installation failed"
**Solution**:
1. Run installer as Administrator
2. Disable antivirus temporarily
3. Try again

### Issue: "Can't login"
**Solution**:
1. Make sure you're using the correct Google account
2. Check internet connection
3. Try: `gcloud auth login --no-launch-browser`

## Alternative: Manual Installation

If installer doesn't work:

1. Download ZIP: https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.zip
2. Extract to `C:\google-cloud-sdk`
3. Run `C:\google-cloud-sdk\install.bat`
4. Run `C:\google-cloud-sdk\bin\gcloud init`

## Next Steps

After installation:
1. Close this terminal
2. Open NEW terminal
3. Run: `gcloud --version`
4. Then we'll deploy the backend!

# cane-client

## Migration guide

1. **Fork the Repository**
   Click the Fork button in the top-right corner of this repository to create your own copy.

2. **Enable GitHub Pages**
   Go to Settings → Pages in your repository. Enable GitHub Pages using the `gh-pages` branch. To trigger the CI pipeline and verify the build, create a test commit on the `main` branch.

3. **Update GitHub References**
   Replace all occurrences of [Dmitrii](https://github.com/lasjdhu)'s GitHub username (`lasjdhu`) with your own in the following files:

   - `app/(protected)/game-*`
     This is required because Unity and Flutter games will be hosted on your own GitHub Pages.

4. **Create an Expo Account**

   - Sign up at [Expo dashboard](https://expo.dev)
   - Create a new project with the slug `cane-client`
   - Follow the on-screen instructions to connect the repository to Expo. You will receive a project ID for CLI commands.
   - Refer to the [EAS documentation](https://docs.expo.dev/build/setup/) for setup guidance.

5. **Update Expo References**
   Replace all occurrences of [Dmitrii](https://github.com/lasjdhu)'s Expo username (`jbkdfkl`) with your own in:
   - `app.json`
   - The `android/` folder
     - Update all occurrences of `jbkdfkl` throughout the folder
     - Rename the directory `android/app/src/main/java/com/jbkdfkl` to `android/app/src/main/java/com/your-username`

## Maintenance guide

- Keep your dependencies up-to-date. Expo's SDK **MUST** be updated regularly. Run `npm run doctor` for guidance.
- Ensure CI pipelines pass before deploying.
- Refer to the `docs` folder for architectural diagrams and explanations.
- Run `npm run style`, `npm run lint`, `npm run doctor` before pushing changes. Otherwise CI will fail.
- `npm run ts:check` will be failing until backend writes well structured serializers.
- Refactor the `app/` and `utils/` ASAP. The current code is a mess.
- Follow `TODO` comments in the codebase.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the Project:

   - For the Web version

   ```bash
   npm run web
   ```

   - For the Android version

   ```bash
   npm android
   ```

## Exporting the project

1. Build for Web:

   ```bash
   npx expo export -p web
   ```

   This generates a dist/ folder.

2. Serve locally:

   ```bash
   cd dist
   npx serve
   ```

For more details, refer to [Expo web publishing docs](https://docs.expo.dev/distribution/publishing-websites/)

## Continuous Integration (CI)

1. `nodejs.yml`

   - Triggered on every push to main.
   - Builds the project and pushes the dist/ folder to the dist branch.
   - You can deploy directly from the dist branch.

2. `deploy.yml`

   - Verifies that Unity and Flutter games build correctly.
   - If there are code changes, the pipeline builds both games and pushes the output to the gh-pages branch.

Games will be accessible at:

- `https://<your-github-username>.github.io/cane-client/unity`
- `https://<your-github-username>.github.io/cane-client/flutter`

## Project Structure

Refer to the `docs` folder for diagrams and detailed explanations.

- `.github/` - CI configurations (`nodejs.yml`, `deploy.yml`)
- `android/` - Native Android code. Initially it was generated with Expo with `npx expo prebuild`.
  Contains two native modules:
  - `EEGBuffer` by [Xavier](https://github.com/xavi-999) - Manages EEG data
  - `MotionEventModule` by [Dmitrii](https://github.com/lasjdhu) - Handles touch events
- `app/` - Main React Native codebase
- `assets/` - Images and sounds
- `components/` - Reusable components
  - `ui/` - Auto-generated components from `@gluestack/ui` library. See [gluestack docs](https://gluestack.io/)
- `utils/` - TypeScript utilities and static data (_TODO: refactor_)
  - `api/` - API utils. Schema is described in `openapi-schema.yml` and utils are generated with `npm run generate-api-hooks`. `apiFetcher.ts` and `apiContext.ts` are the only files that should be modified manually. See [openapi-codegen](https://github.com/fabien0102/openapi-codegen/)
- `app.json` - Expo configuration file
- `eas.json` - EAS build configuration file

## Modules Overview

### Games

- **Location:** `app/(protected)/game-[one|two].[web|].tsx`
- **Build Process:**

  - **Flutter Game (via CI):**

    ```yml
    - name: Install dependencies and build Flutter
      run: |
        cd flutter_game
        flutter pub get
        flutter build web --base-href /cane-client/flutter/
    ```

  - **Unity Game:** Built manually in Unity Editor (version `2022.3.20f1`), output to `unity/build/`
    The build is then copied to the `/cane-client/unity/` in CI pipeline.

- **Hosting:** Built games are pushed to `gh-pages` and served via GitHub Pages.
- **Testing Locally**:

  1. Modify game files (`flutter_game/lib/*.dart` or `unity/source/Assets/*`).
  2. Build:

  - Flutter: `flutter build web`
  - Unity: Build in Unity Editor → `unity/build/`

  3. Serve locally:

  - Flutter: `cd flutter_game/build/web` → `python3 -m http.server 8000`
  - Unity: `cd unity/build` → `python3 -m http.server 8000`

  4. Update URLs in `app/(protected)/game-[one|two].tsx`:

     ```tsx
     source={{ uri: "http://192.168.xx.xx:8000" }}
     ```

### Audio

- **Location:** `app/(protected)/audio.tsx`
- **Library:** `expo-av` ([Docs](https://docs.expo.dev/versions/latest/sdk/audio-av/))
- **Configuration:**

  ```tsx
  const { recording } = await Audio.Recording.createAsync(...);
  ```

- Adjust recording quality using [custom settings](https://docs.expo.dev/versions/latest/sdk/audio/#recordingoptionsandroid)
- Available extensions, bitrates, channels etc are specified in [Android docs](https://developer.android.com/media/platform/supported-formats)
- Web browser supports only [these mimeTypes](https://stackoverflow.com/questions/41739837/all-mime-types-supported-by-mediarecorder-in-firefox-and-chrome)

### Canvas (Android only)

- **Location:** `app/(protected)/canvas.tsx`
- **Native Module:** `MotionEventModule` (Kotlin) in `android/app/src/main/java/com/yourname/caneclient/MotionEventModule.kt`

### EEG (Android only)

- **Location:** `app/(protected)/eeg.tsx`, `app/(protected)/EEGScan.tsx`, `app/(protected)/eeg-save.tsx`
- **Native Module:** `EEGBuffer` (Kotlin)
- **Data flow:** User gets instructions → EEG is scanned → Data is saved when online
- Contact Xavier for module-specific questions.

### Questionnaires and History

- **Navigation:** Uses React Navigation's dynamic routes ([Docs](https://docs.expo.dev/develop/dynamic-routes/))

### Other

- Built with plain React Native code where no additional modules are specified.

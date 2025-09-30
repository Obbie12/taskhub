# mobile

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
# Flutter Mobile App

A Flutter application for iOS and Android that interfaces with the Go backend API.

## Architecture

### State Management: Provider
We chose Provider for state management because:
- It's recommended by the Flutter team and widely adopted
- Simple to implement and understand
- Provides efficient state management with minimal boilerplate
- Well-suited for apps of this scale
- Excellent documentation and community support

### Navigation
Uses Flutter's built-in Navigator 2.0 for screen transitions and routing.

### API Integration
Uses the `http` package to communicate with the Go backend. All API calls are centralized in service classes.

### Secure Storage
Uses `flutter_secure_storage` to securely store JWT tokens on the device.

## Project Structure

```
lib/
├── main.dart              # App entry point
├── models/               # Data models (User, Task)
├── services/             # API service classes
├── providers/            # State management (Auth, Tasks)
├── screens/              # UI screens
├── widgets/              # Reusable UI components
└── utils/                # Constants and helpers
```

## Setup

1. Ensure Flutter is installed and configured
2. Run `flutter pub get` to install dependencies
3. Update API base URL in `lib/utils/constants.dart` if needed
4. Run `flutter run` to start the app

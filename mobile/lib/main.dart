import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/task_provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (ctx) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, TaskProvider>(
          create: (ctx) => TaskProvider(null, []),
          update: (ctx, auth, previousTasks) => TaskProvider(
            auth.token,
            previousTasks == null ? [] : previousTasks.tasks,
          ),
        ),
      ],
      child: MaterialApp(
        title: 'Task Manager',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: Consumer<AuthProvider>(
          builder: (ctx, auth, _) {
            if (auth.isLoading) {
              return Scaffold(
                body: Center(
                  child: CircularProgressIndicator(),
                ),
              );
            }
            return auth.isAuth ? DashboardScreen() : LoginScreen();
          },
        ),
        routes: {
          LoginScreen.routeName: (ctx) => LoginScreen(),
          DashboardScreen.routeName: (ctx) => DashboardScreen(),
        },
      ),
    );
  }
}

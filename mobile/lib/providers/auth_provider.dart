import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  bool _isLoading = true;
  final FlutterSecureStorage _storage = FlutterSecureStorage();
  final AuthService _authService = AuthService();

  String? get token => _token;
  bool get isAuth => _token != null;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    try {
      _token = await _storage.read(key: 'token');
    } catch (error) {
      _token = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final result = await _authService.login(email, password);
    if (result['success'] == true) {
      _token = result['token'];
      await _storage.write(key: 'token', value: _token);
      notifyListeners();
    }
    return result;
  }

  Future<Map<String, dynamic>> register(String email, String password) async {
    final result = await _authService.register(email, password);
    if (result['success'] == true) {
      _token = result['token'];
      await _storage.write(key: 'token', value: _token);
      notifyListeners();
    }
    return result;
  }

  Future<void> logout() async {
    _token = null;
    await _storage.delete(key: 'token');
    notifyListeners();
  }
}

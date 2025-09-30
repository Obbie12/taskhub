import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Future<http.Response> get(String endpoint, {String? token}) async {
    final response = await http.get(
      Uri.parse('$BASE_URL/$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return response;
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final response = await http.post(
      Uri.parse('$BASE_URL/$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: json.encode(body),
    );
    return response;
  }

  Future<http.Response> put(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final response = await http.put(
      Uri.parse('$BASE_URL/$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: json.encode(body),
    );
    return response;
  }

  Future<http.Response> delete(String endpoint, {String? token}) async {
    final response = await http.delete(
      Uri.parse('$BASE_URL/$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return response;
  }
}

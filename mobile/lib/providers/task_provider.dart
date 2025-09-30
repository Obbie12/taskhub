import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/api_service.dart';

class TaskProvider with ChangeNotifier {
  List<Task> _tasks = [];
  final String? _token;
  final ApiService _apiService = ApiService();

  TaskProvider(this._token, List<Task> tasks) {
    _tasks = tasks;
    if (_token != null) {
      fetchTasks();
    }
  }

  List<Task> get tasks => [..._tasks];

  Future<void> fetchTasks() async {
    try {
      final response = await _apiService.get('tasks', token: _token);
      if (response.statusCode == 200) {
        final List<dynamic> tasksData = json.decode(response.body);
        _tasks = tasksData.map((taskData) => Task.fromJson(taskData)).toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load tasks: ${response.statusCode}');
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> addTask(String title, String status) async {
    try {
      final response = await _apiService.post(
        'tasks',
        {'title': title, 'status': status},
        token: _token,
      );
      if (response.statusCode == 201) {
        await fetchTasks();
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> updateTask(int taskId, String title, String status) async {
    try {
      final response = await _apiService.put(
        'tasks/$taskId',
        {'title': title, 'status': status},
        token: _token,
      );
      if (response.statusCode == 200) {
        await fetchTasks();
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> deleteTask(int taskId) async {
    try {
      final response = await _apiService.delete('tasks/$taskId', token: _token);
      if (response.statusCode == 200) {
        await fetchTasks();
      }
    } catch (error) {
      throw error;
    }
  }
}

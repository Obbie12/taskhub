class Task {
  final int id;
  final int userId;
  final String title;
  final String status;
  
  Task({
    required this.id,
    required this.userId,
    required this.title,
    required this.status,
  });
  
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      userId: json['user_id'],
      title: json['title'],
      status: json['status'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'status': status,
    };
  }
}

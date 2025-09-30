"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', status: 'pending' });
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user && user.token) {
            fetchTasks();
        }
    }, [user, router]);

    const fetchTasks = async () => {
        if (!user || !user.token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8080/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tasks data:', data);
                // Ensure data is always an array
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    console.error('Tasks data is not an array:', data);
                    setTasks([]);
                }
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch tasks:', response.status, errorText);
                setError('Failed to fetch tasks');
                setTasks([]);
            }
        } catch (error) {
            setError('Network error occurred');
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(taskForm),
            });
            if (response.ok) {
                setShowModal(false);
                setTaskForm({ title: '', status: 'pending' });
                fetchTasks();
            } else {
                setError('Failed to create task');
            }
        } catch (error) {
            setError('Network error occurred');
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/tasks/${editingTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(taskForm),
            });
            if (response.ok) {
                setShowModal(false);
                setEditingTask(null);
                setTaskForm({ title: '', status: 'pending' });
                fetchTasks();
            } else {
                setError('Failed to update task');
            }
        } catch (error) {
            setError('Network error occurred');
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                fetchTasks();
            } else {
                setError('Failed to delete task');
            }
        } catch (error) {
            setError('Network error occurred');
            console.error('Error deleting task:', error);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setTaskForm({ title: '', status: 'pending' });
        setShowModal(true);
        setError('');
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setTaskForm({ title: task.title, status: task.status });
        setShowModal(true);
        setError('');
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
        setTaskForm({ title: '', status: 'pending' });
        setError('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Redirecting to login...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Task Manager</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                        >
                            Add New Task
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        {tasks && tasks.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <li key={task.id}>
                                        <div className="px-4 py-4 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Status: <span className={`font-medium ${task.status === 'completed' ? 'text-green-600' : task.status === 'in progress' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                                            {task.status}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(task)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No tasks found. Create your first task!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h3>
                            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Status
                                    </label>
                                    <select
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={taskForm.status}
                                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                                    >
                                        {editingTask ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

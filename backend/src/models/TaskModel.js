import { getTasksByUsername } from '../services/task_services/getTasksByUsername.js';
import { addTask } from '../services/task_services/addTask.js';
import { deleteTask } from '../services/task_services/deleteTask.js';
import { updateTask } from '../services/task_services/updateTask.js';
import { getTaskById } from '../services/task_services/getTaskById.js';
import { getTasks } from '../services/task_services/getTasks.js';

class TaskModel {
    async getTaskbyUsername(username) {
        try {
            return await getTasksByUsername(username);
        } catch (error) {
            throw new Error('Error retrieving tasks for user');
        }
    }

    async getTasks() {
        try {
            return await getTasks();
        } catch (error) {
            throw new Error('Error retrieving tasks');
        }
    }

    async getTaskById(taskId) {
        try {
            const task = await getTaskById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            return task;
        } catch (error) {
            throw new Error('Error retrieving task');
        }
    }

    async addTask(taskData) {
        try {
            await addTask(taskData);
        } catch (error) {
            throw new Error('Error creating task');
        }
    }

    async updateTask(taskId, updatedData) {
        try {
            await updateTask(taskId, updatedData);
        } catch (error) {
            throw new Error('Error updating task');
        }
    }

    async deleteTask(taskId) {
        try {
            await deleteTask(taskId);
        } catch (error) {
            throw new Error('Error deleting task');
        }
    }
}

export default new TaskModel();
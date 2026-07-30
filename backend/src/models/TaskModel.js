import { getTasksByUsername } from '../services/task_services/getTasksByUsername';
import { addTask } from '../services/task_services/addTask';
import { deleteTask } from '../services/task_services/deleteTask';
import { updateTask } from '../services/task_services/updateTask';
import { getTaskById } from '../services/task_services/getTaskById';
import { getTasks } from '../services/task_services/getTasks';

class TaskModel {

    async getTaskbyUsername(username) {
        try {
            const tasks = await getTaskbyUsername(username);
            return tasks;
        } catch (error) {
            throw new Error('Error retrieving tasks for user');
        }
    }

    async getTasks() {
        try {
            const tasks = await getTasks();
            return tasks;
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

module.exports = new TaskModel();
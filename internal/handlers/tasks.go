package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go-echo-postgres/internal/database"
)

type TaskHandler struct {
	db database.Service
}

func NewTaskHandler(db database.Service) *TaskHandler {
	return &TaskHandler{db: db}
}

type CreateTaskRequest struct {
	Title  string `json:"title"`
	Status string `json:"status"`
}

type UpdateTaskRequest struct {
	Title  string `json:"title"`
	Status string `json:"status"`
}

func (h *TaskHandler) GetTasks(c echo.Context) error {
	userID := c.Get("user_id").(int64)
	
	tasks, err := h.db.GetTasksByUserID(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get tasks: "+err.Error())
	}
	
	return c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) CreateTask(c echo.Context) error {
	userID := c.Get("user_id").(int64)
	
	var req CreateTaskRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
	}
	
	taskID, err := h.db.CreateTask(userID, req.Title, req.Status)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create task: "+err.Error())
	}
	
	return c.JSON(http.StatusCreated, map[string]int64{"id": taskID})
}

func (h *TaskHandler) UpdateTask(c echo.Context) error {
	userID := c.Get("user_id").(int64)
	taskIDStr := c.Param("id")
	taskID, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid task ID")
	}
	
	var req UpdateTaskRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
	}
	
	err = h.db.UpdateTask(userID, taskID, req.Title, req.Status)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update task: "+err.Error())
	}
	
	return c.JSON(http.StatusOK, map[string]string{"message": "task updated successfully"})
}

func (h *TaskHandler) DeleteTask(c echo.Context) error {
	userID := c.Get("user_id").(int64)
	taskIDStr := c.Param("id")
	taskID, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid task ID")
	}
	
	err = h.db.DeleteTask(userID, taskID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to delete task: "+err.Error())
	}
	
	return c.JSON(http.StatusOK, map[string]string{"message": "task deleted successfully"})
}

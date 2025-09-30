package server

import (
	"net/http"
	"os"

	"go-echo-postgres/internal/handlers"
	"go-echo-postgres/internal/middleware/auth"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"https://*", "http://*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Auth routes
	authHandler := handlers.NewAuthHandler(s.db)
	e.POST("/register", authHandler.Register)
	e.POST("/login", authHandler.Login)

	// Health check
	e.GET("/health", s.healthHandler)

	// Protected routes
	protected := e.Group("")
	protected.Use(auth.JWTMiddleware(os.Getenv("JWT_SECRET")))

	taskHandler := handlers.NewTaskHandler(s.db)
	protected.GET("/tasks", taskHandler.GetTasks)
	protected.POST("/tasks", taskHandler.CreateTask)
	protected.PUT("/tasks/:id", taskHandler.UpdateTask)
	protected.DELETE("/tasks/:id", taskHandler.DeleteTask)

	return e
}

func (s *Server) healthHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, s.db.Health())
}

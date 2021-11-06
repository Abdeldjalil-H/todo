from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('', views.api_overview, name='overview'),
    path('tasks-list/', views.tasks_list, name='tasks_list'),
    path('task-detail/<int:pk>/', views.task_detail, name='detail'),
    path('task-create/', views.create_task, name='task_create'),
    path('task-update/<int:pk>/', views.update_task, name='task_update'),
    path('tasks-clear/', views.clear_tasks, name='tasks_clear'),
    path('task-delete/<int:pk>/', views.delete_task, name='task_delete'),
]
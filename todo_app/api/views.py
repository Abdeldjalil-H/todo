from api.models import Task
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializer

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List': '/tasks-list/',
        'Detail view': '/task-detail/<str:pk>',
        'Create': '/task-create',
        'Update': '/task-update/<str:pk>',
        'Delete': '/task-delete/<str:pk>'
    }

    return Response(api_urls)

@api_view(['GET'])
def tasks_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def task_detail(request, pk):
    task = Task.objects.get(pk=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)

@api_view(['POST'])
def update_task(request, pk):
    task = Task.objects.get(pk=pk)
    serializer = TaskSerializer(instance=task, data=request.data)

    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_task(request, pk):
    Task.objects.get(pk=pk).delete()
    
    return Response('Item succesfully deleted.')

@api_view(['DELETE'])
def clear_tasks(request):
    Task.objects.all().delete()
    
    return Response('Items succesfully deleted.')
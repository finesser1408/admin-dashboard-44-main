from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a default admin user if it does not exist'

    def handle(self, *args, **options):
        username = 'Admin'
        email = 'admin@example.com'
        password = 'Admin1234'

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created user {username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))

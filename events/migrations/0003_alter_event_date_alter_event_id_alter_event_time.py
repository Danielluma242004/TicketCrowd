# Generated by Django 5.0.2 on 2024-02-15 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_delete_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='event',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='event',
            name='time',
            field=models.TextField(),
        ),
    ]

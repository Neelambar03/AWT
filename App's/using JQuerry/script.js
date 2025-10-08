$(document).ready(function() {
    // Add task
    $('#addBtn').click(function() {
        const taskText = $('#taskInput').val().trim();
        if (taskText !== '') {
            const newTask = $('<li></li>').text(taskText);
            const deleteBtn = $('<button>Delete</button>');
            
            deleteBtn.click(function() {
                $(this).parent().remove();
            });

            newTask.click(function() {
                $(this).toggleClass('done');
            });

            newTask.append(' ').append(deleteBtn);
            $('#taskList').append(newTask);
            $('#taskInput').val('');
        }
    });

    // Allow Enter key to add task
    $('#taskInput').keypress(function(e) {
        if (e.which === 13) {
            $('#addBtn').click();
        }
    });
});

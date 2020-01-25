var taskListResizeTimeout = void 0;



window.addEventListener('resize', function () {

    clearTimeout(taskListResizeTimeout);

    taskListResizeTimeout = setTimeout(taskListResponsive, 250);

});



function taskListResponsive() {

    var bodyWidth = document.body.offsetWidth;

    var resultContentsArr = document.querySelectorAll('.row.task .content');



    if (bodyWidth < 601) {

        resultContentsArr.forEach(function (resContent) {

            resContent.style.display = 'block';

            resContent.classList.add('task-container');

        });

    } else {

        resultContentsArr.forEach(function (resContent) {

            resContent.style.display = 'flex';

            resContent.classList.remove('task-container');

        });

    }

}



taskListResponsive();
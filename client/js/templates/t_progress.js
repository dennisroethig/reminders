Template.progress.isStep1 = function () {
    return Session.equals('newTaskStatus', 'type');
};

Template.progress.isStep2 = function () {
    // return Session.equals('newTaskStatus', 'priority');
    return Session.equals('newTaskStatus', 'delay');
};

Template.progress.isStep3 = function () {
    return Session.equals('newTaskStatus', 'priority');
};

Template.progress.isStep4 = function () {
    return Session.equals('newTaskStatus', 'name') && Session.equals('newTaskSending', false);
};

Template.progress.isStep5 = function () {
    return Session.equals('newTaskStatus', 'name') && Session.equals('newTaskSending', true);
};

Template.progress.isStep6 = function () {
    return Session.equals('newTaskStatus', 'created');
};

Template.progress.isNotCreated = function () {
    return !Session.equals('newTaskStatus', 'created');
};

Template.progress.type = function () {
    return Session.get('newTaskType');
};

Template.progress.delay = function () {
    if (Session.get('newTaskDelayString')) {
        return Session.get('newTaskDelayString') + ' min';
    }
    if (Session.get('newTaskDelayString') === 0) {
        return 'Now';
    }

};

Template.progress.priority = function () {
    var priority = Session.get('newTaskPriority');

    if (priority === 1) {
        return 'High';
    }

    if (priority === 3) {
        return 'Normal';
    }

    if (priority === 5) {
        return 'Low';
    }

};
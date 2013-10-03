Template.main.isUser = function () {
    return Meteor.user();
};

Template.main.routeNewTask = function () {
    console.log(Session.get('filter'))
    return Session.get('filter') === 'new';
};
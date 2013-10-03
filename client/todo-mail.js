Tasks = new Meteor.Collection('tasks');

Settings = new Meteor.Collection('settings');

Meteor.subscribe('tasks');
Meteor.subscribe('settings');

// Set filter to all on startup: all, pending, sent
Session.set('filter', 'all');
Session.set('userID', false);
Session.set('settingsID', false);

Session.set('newTaskStatus', false);
Session.set('newTaskType', false);
Session.set('newTaskName', false);
Session.set('newTaskDelay', false);
Session.set('newTaskDelayString', false);
Session.set('newTaskCreated', false);
Session.set('newTaskSending', false);
Session.set('newTaskPriority', false);


filter_selections = {
    all: {},
    new: {},
    setting: {},
    pending: {sent: false},
    sent: {sent: true}
};

// Get selector types as array
var filters = _.keys(filter_selections);

var routes = {};
_.each(filters, function(filter) {
    routes['/'+filter] = function() {
        Session.set('filter', filter);

        if (filter === 'new') {
            Session.set('newTaskStatus', 'type');
            Session.equals('newTaskType', 'text');
        }

    };
});

var router = Router(routes);
router.init();


// Meteor.users().find({ _id: this.userId },
//     { fields: { the-extra-fields-that-you-want-go-here: 1 } }
// );

Deps.autorun(function(){

    if(Meteor.user()){
        console.log('USER LOGGED IN!!!', Meteor.userId());
        Session.set('userID', Meteor.userId());


        // var settings = Settings.findOne({ user : Session.get('userID')});
        // console.log('search settings', settings);
        // if (!settings) {
        //     console.log('create settings');
        //     Session.set('settingsID', Settings.insert({
        //         user: Meteor.userId(),
        //         friends: [{name: 'dennis'}, {name: 'tim'}]
        //     }));
        // }
        

        

    }
});


// HELPER
var todos_completed_helper = function() {
    return Todos.find({sent: true}).count();
};
var todos_not_completed_helper = function() {
    return Todos.find({sent: false}).count();
};
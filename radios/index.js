'use strict';

var Model = Backbone.Model;

var Collection = Backbone.Collection;

var View = Backbone.View;

var Radio = Model.extend({

  defaults: {
    'active': false,
    'value': undefined
  },

  // Private helper to toggle a radio's state
  _toggleActive: function (options) {
    this.set({ 'active': ! this.get('active') }, options);
  },

  isActive: function () {
    return !! this.get('active');
  },

  // Helper to retreive radio's value
  getValue: function () {
    return this.get('value');
  }
  
});

var Radios = Collection.extend({

  model: Radio,

  // Specify the radio group name
  getName: function () {
    return 'options';
  },

  // Helper to toggle inbetween radios
  toggleActive: function (id) {

    // An invarient exists in that only a single radio is active at a time
    var singleton = this.findWhere({ 'active': true });

    // Note how there may be no active radio initially
    if (!! singleton) 

      // Also, trigger only one change event in this function
      singleton._toggleActive({ silent: true });

    // Set the next
    this.get(id)._toggleActive();
  }

});

var List = View.extend({

  template: 
  '\
    <% each(function (radio) { %>\
      <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="<%= radio.cid %>">\
        <input type="radio" id="<%= radio.cid %>" class="mdl-radio__button" name="<%= getName() %>" value="" <% radio.isActive() && print("checked") %> >\
        <span class="mdl-radio__label"><%= radio.getValue() %></span>\
      </label>\
    <% }); %>\
  ',

  initialize: function () {

    // Re-render the radio list when the group state is modified
    this.listenTo(this.collection, 'change', this.render);
  },

  render: function () {
    this.$el.html(_.template(this.template)(this.collection));
    componentHandler.upgradeElements(this.el);
    return this.$el;
  },

  events: {
    'click .mdl-radio__button': 'onRadioClick'
  },

  onRadioClick: function (event) {

    // Prevent the browser from handling the view update as our listener re-renders instead
    event.preventDefault();
    var cid = event.currentTarget.id;
    this.collection.toggleActive(cid);
  }

});

$(function () {
  var body = $('body');
  var radios = new Radios([{ value: 'Hello World' }, { value: 'Goodbye World' }]);
  var list = new List({ collection: radios });
  list.render().appendTo(body);
})

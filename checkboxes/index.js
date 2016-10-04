'use strict';

var Model = Backbone.Model;

var Collection = Backbone.Collection;

var View = Backbone.View;

var Checkbox = Model.extend({

  defaults: {
    'checked': false,
    'value': undefined
  },

  // Private helper to toggle a checkbox's state
  _toggleChecked: function () {
    this.set({ 'checked': ! this.get('checked') });
  },

  isChecked: function () {
    return !! this.get('checked');
  },

  // Helper to retreive radio's value
  getValue: function () {
    return this.get('value');
  }
  
});

var Checkboxes = Collection.extend({

  model: Checkbox,

  toggleChecked: function (id) {
    this.get(id)._toggleChecked();
  }

});

var List = View.extend({

  template: 
  '\
    <% each(function (checkbox) { %>\
      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="<%= checkbox.cid %>">\
        <input type="checkbox" id="<%= checkbox.cid %>" class="mdl-checkbox__input" <% checkbox.isChecked() && print("checked") %> >\
        <span class="mdl-checkbox__label"><%= checkbox.getValue() %></span>\
      </label>\
    <% }); %>\
  ',

  render: function () {
    this.$el.html(_.template(this.template)(this.collection));
    componentHandler.upgradeElements(this.el);
    return this.$el;
  },

  events: {
    'click .mdl-checkbox__input': 'onCheckboxClick'
  },

  onCheckboxClick: function (event) {
    var cid = event.currentTarget.id;
    this.collection.toggleChecked(cid);
  }

});

$(function () {
  var body = $('body');
  var checkboxes = new Checkboxes([{ checked: true, value: 'Hello World' }, { value: 'Goodbye World' }]);
  var list = new List({ collection: checkboxes });
  list.render().appendTo(body);
})

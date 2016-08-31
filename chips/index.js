'use strict';

var Model = Backbone.Model;

var Collection = Backbone.Collection;

var View = Backbone.View;

var Chip = Model.extend({

  defaults: {
    'value': undefined,
  },

  getValue: function () {
    return this.get('value');
  }
  
});

var Chips = Collection.extend({

  model: Chip
  
});

var List = View.extend({

  template: 
  '\
    <% each(function (chip) { %>\
      <span class="mdl-chip mdl-chip--deletable">\
          <span class="mdl-chip__text"><%= chip.getValue() %></span>\
          <button type="button" class="mdl-chip__action chip-delete" id="<%= chip.cid %>">\
            <i class="material-icons">cancel</i>\
          </button>\
      </span>\
    <% }); %>\
  ',

  initialize: function () {
    this.listenTo(this.collection, 'change update', this.render);
  },

  render: function() {
    this.$el.html(_.template(this.template)(this.collection));
    componentHandler.upgradeElements(this.el);
    return this.$el;
  },

  events: {
    'click .chip-delete': 'onChipDeleteClick'
  },

  onChipDeleteClick: function (event) {
    var cid = event.currentTarget.id;
    this.collection.remove(cid);
  },

});

var Input = View.extend({

  template: 
  '\
    <div class="mdl-textfield mdl-js-textfield" style="width: 100%; display: flex; flex-direction: row">\
      <div id="chips-list" style="padding: 0 0 8px 3px;"></div>\
      <div style="flex: auto; padding: 0 0 8px 3px;">\
        <input type="text" autocomplete="off" list="chip-list" id="chip-input" style="outline: none; border: none; line-height: 32px; padding: 0 12px; margin: 2px 0; font-size: 13px;">\
      </div>\
      <datalist id="chip-list">\
        //Ideally populate the list via ajax or loaded json\
        <% Array(10).fill("Chip").forEach(function (element) { %>\
          <option class="chip-option" value="<%= element %>">\
        <% }) %>\
      </datalist>\
    </div>\
  ',

  initialize: function () {},

  render: function() {
    this.$el.html(_.template(this.template)(this.collection));
    var list = new List({ collection: this.collection });
    list.render().appendTo(this.$('#chips-list'));
    componentHandler.upgradeElements(this.el);
    return this.$el;
  },

  events: {
    'select #chip-input': 'onChipInputSelect',
    'keydown #chip-input': 'onChipInputKeydown'
  },

  onChipInputSelect: function (event) {
    // TODO
  },

  onChipInputEnter: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val().trim();
    this.collection.push({value: value});
    $input.val('');
  },

  onChipInputBackspace: function (event) {
    var $input = this.$(event.currentTarget);
    var value = $input.val();
    if (!value) this.collection.pop();
  },

  onChipInputKeydown: function (event) {
    switch (event.which) {
      case 13: this.onChipInputEnter.apply(this, arguments); break;
      case 8: this.onChipInputBackspace.apply(this, arguments); break;
    }
  }

});

$(function () {
  var body = $('body');
  var chips = new Chips({ value: "Hello World" });
  var input = new Input({ collection: chips });
  input.render().appendTo(body);
})

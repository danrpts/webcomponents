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
  }

});

var Input = View.extend({

  template: 
  '\
  <div style="width: 800px; margin: 0 auto;">\
    <div class="mdl-textfield mdl-js-textfield" style="width: 100%;">\
      <div style="display: flex; flex-direction: row; flex-wrap: wrap; border-bottom: 1px solid rgba(0,0,0,.12);">\
        <div id="chips-list" style="flex-shrink: 1; padding: 0 0 8px 3px;"></div>\
        <div style="flex-grow: 1; flex-shrink: 2; padding: 0 0 8px 3px;">\
          <input class="mdl-textfield__input" type="text" autocomplete="off" list="chip-list" id="chip-input" style="width: 100%; border: none; line-height: 32px; padding: 0; margin: 2px 0; font-size: 13px;">\
          <datalist id="chip-list">\
            <!-- Ideally populate the list via ajax or loaded json -->\
            <% Array(10).fill("Chip").forEach(function (element) { %>\
              <option class="chip-option" value="<%= element %>">\
            <% }) %>\
          </datalist>\
        </div>\
      </div>\
      <!-- Todo: css for label alignment -->\
      <label class="mdl-textfield__label" for="chip-input"></label>\
    </div>\
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
    var collection = this.collection;
    var attributes = { value: value };
    if (!!value && !collection.findWhere(attributes)) {
      collection.push(attributes);
      $input.val('');
    }
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

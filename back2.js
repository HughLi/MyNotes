(function () {
  var a = function (b) {
    _.extend(this, {
      el: null,
      _id: _.uniqueId("listfieldOptions"),
      _viewEl: null,
      _listEl: null,
      options: [],
      value: null,
      disable: false
    }, b);
    this._init();
    this._optionsVisible();
    this.setValue(this.value);
  };
  a.prototype._init = function () {
    var b = this.el;
    if (!b) {
      return;
    }
    b.append(this._renderOptions());
    this._viewEl = b.find(".com_list_table_rcell");
    this._listEl = b.find("#" + this._id);
    this._listEl.on("change", _.bind(this._selectOption, this));
  };
  a.prototype._selectOption = function () {
    this.setValue(this._listEl.val());
  };
  a.prototype._renderOptions = function () {
    if (!a._tpl) {
      a._tpl = _.template('<select id="<%=id%>" class="com_listfield_select"><%for(var i =0; i < options.length; i++) {%><option value="<%=options[i].value%>"><%=options[i].text%></option><%}%></select>');
    }
    return a._tpl({
      id: this._id,
      options: this.options
    });
  };
  a.prototype.setOptions = function (c, b) {
    if (_.isEqual(c, this.options)) {
      return false;
    }
    var d = _(c).map(function (e) {
      return '<option value="' + e.value + '">' + e.text + "</option>";
    });
    this._listEl.html(d.join(""));
    this._viewEl.text("");
    this.options = c;
    this._optionsVisible();
    if (b) {
      b = "LISTFIELD_SILENT";
    }
    this.setValue(b);
  };
  a.prototype._optionsVisible = function () {
    if (!this.options || !this.options.length) {
      this._listEl.hide();
    } else {
      this._listEl.show();
    }
  };
  a.prototype.clear = function () {
    this.options.length = 0;
    this.value = null;
    this._optionsVisible();
    this._listEl.html("");
    this._viewEl.text("");
  };
  a.prototype.setValue = function (f) {
    var d = this.options;
    var c = false;
    if (f == "LISTFIELD_SILENT") {
      c = true;
      f = undefined;
    }
    if (!d.length) {
      return;
    }
    var g = "",
      e = _.any(d, function (h) {
        if (f == h.value) {
          g = h.text;
          return true;
        }
        return false;
      });
    if (!e) {
      var b = d[0];
      f = b.value;
      g = b.text;
    }
    this.value = f;
    this._listEl.val(f);
    this._viewEl.text(g);
    if (this.onchange && !c) {
      this.onchange(f, g);
    }
  };
  a.prototype.getValue = function () {
    return this.value;
  };
  a.prototype.getText = function () {
    return this._viewEl.text();
  };
  a.prototype.enable = function () {};
  a.prototype.disable = function () {};
  App.ListField = a;
})();
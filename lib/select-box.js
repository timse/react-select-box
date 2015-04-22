'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var idInc = 0;

var keyHandlers = {
  38: 'handleUpKey',
  40: 'handleDownKey',
  32: 'handleSpaceKey',
  13: 'handleEnterKey',
  27: 'handleEscKey',
  74: 'handleDownKey',
  75: 'handleUpKey'
};

function interceptEvent(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

module.exports = _React2['default'].createClass({

  displayName: 'exports',

  getInitialState: function getInitialState() {
    return {
      id: 'react-select-box-' + ++idInc,
      open: false,
      focusedIndex: -1,
      pedningValue: []
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      closeText: 'Close'
    };
  },

  changeOnClose: function changeOnClose() {
    return this.isMultiple() && String(this.props.changeOnClose) === 'true';
  },

  updatePendingValue: function updatePendingValue(value, cb) {
    if (this.changeOnClose()) {
      this.setState({ pendingValue: value }, cb);
      return true;
    }
    return false;
  },

  componentWillMount: function componentWillMount() {
    this.updatePendingValue(this.props.value);
  },

  componentWillReceiveProps: function componentWillReceiveProps(next) {
    this.updatePendingValue(next.value);
  },

  clickingOption: false,

  blurTimeout: null,

  handleFocus: function handleFocus() {
    clearTimeout(this.blurTimeout);
  },

  handleBlur: function handleBlur() {
    clearTimeout(this.blurTimeout);
    this.blurTimeout = setTimeout(this.handleClose, 0);
  },

  handleMouseDown: function handleMouseDown() {
    this.clickingOption = true;
  },

  handleChange: function handleChange(val, cb) {
    var _this = this;

    return function (event) {
      _this.clickingOption = false;
      interceptEvent(event);
      if (_this.isMultiple()) {
        var selected = [];
        if (val != null) {
          selected = _this.value().slice(0);
          var index = selected.indexOf(val);
          if (index !== -1) {
            selected.splice(index, 1);
          } else {
            selected.push(val);
          }
        }
        _this.updatePendingValue(selected, cb) || _this.props.onChange(selected);
      } else {
        _this.updatePendingValue(val, cb) || _this.props.onChange(val);
        _this.handleClose();
        _this.refs.button.getDOMNode().focus();
      }
    };
  },

  handleNativeChange: function handleNativeChange(event) {
    var val = event.target.value;
    if (this.isMultiple()) {
      var children = [].slice.call(event.target.childNodes, 0);
      val = children.reduce(function (memo, child) {
        if (child.selected) {
          memo.push(child.value);
        }
        return memo;
      }, []);
    }
    this.props.onChange(val);
  },

  handleClear: function handleClear(event) {
    var _this2 = this;

    interceptEvent(event);
    this.handleChange(null, function () {
      // only called when change="true"
      _this2.props.onChange(_this2.state.pendingValue);
    })(event);
  },

  toggleOpenClose: function toggleOpenClose(event) {
    interceptEvent(event);
    this.setState({ open: !this.state.open });
    if (this.state.open) {
      return this.setState({ open: false });
    }

    this.handleOpen();
  },

  handleOpen: function handleOpen(event) {
    var _this3 = this;

    interceptEvent(event);
    this.setState({ open: true }, function () {
      _this3.refs.menu.getDOMNode().focus();
    });
  },

  handleClose: function handleClose(event) {
    interceptEvent(event);
    if (!this.clickingOption) {
      this.setState({ open: false, focusedIndex: -1 });
    }
    if (this.changeOnClose()) {
      this.props.onChange(this.state.pendingValue);
    }
  },

  moveFocus: function moveFocus(move) {
    var len = _React2['default'].Children.count(this.props.children);
    var idx = (this.state.focusedIndex + move + len) % len;
    this.setState({ focusedIndex: idx });
  },

  handleKeyDown: function handleKeyDown(event) {
    if (keyHandlers[event.which]) {
      this[keyHandlers[event.which]](event);
    }
  },

  handleUpKey: function handleUpKey(event) {
    interceptEvent(event);
    this.moveFocus(-1);
  },

  handleDownKey: function handleDownKey(event) {
    interceptEvent(event);
    if (!this.state.open) {
      this.handleOpen(event);
    }
    this.moveFocus(1);
  },

  handleSpaceKey: function handleSpaceKey(event) {
    interceptEvent(event);
    if (!this.state.open) {
      this.handleOpen(event);
    } else if (this.state.focusedIndex !== -1) {
      this.handleEnterKey();
    }
  },

  handleEnterKey: function handleEnterKey(event) {
    if (this.state.focusedIndex !== -1) {
      this.handleChange(this.options()[this.state.focusedIndex].value)(event);
    }
  },

  handleEscKey: function handleEscKey(event) {
    if (this.state.open) {
      this.handleClose(event);
    } else {
      this.handleClear(event);
    }
  },

  label: function label() {
    var _this4 = this;

    var selected = this.options().filter(function (option) {
      return _this4.isSelected(option.value);
    }).map(function (option) {
      return option.label;
    });
    return selected.length > 0 ? selected.join(', ') : this.props.label;
  },

  isMultiple: function isMultiple() {
    return String(this.props.multiple) === 'true';
  },

  options: function options() {
    var options = [];
    _React2['default'].Children.forEach(this.props.children, function (option) {
      options.push({
        value: option.props.value,
        label: option.props.children
      });
    });
    return options;
  },

  value: function value() {
    var value = this.changeOnClose() ? this.state.pendingValue : this.props.value;

    if (!this.isMultiple() || Array.isArray(value)) {
      return value;
    }if (value != null) {
      return [value];
    }
    return [];
  },

  hasValue: function hasValue() {
    if (this.isMultiple()) {
      return this.value().length > 0;
    }
    return this.value() != null;
  },

  isSelected: function isSelected(value) {
    if (this.isMultiple()) {
      return this.value().indexOf(value) !== -1;
    }
    return this.value() === value;
  },

  render: function render() {
    var className = 'react-select-box-container';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    if (this.isMultiple()) {
      className += ' react-select-box-multi';
    }
    if (!this.hasValue()) {
      className += ' react-select-box-empty';
    }
    return _React2['default'].createElement(
      'div',
      {
        onKeyDown: this.handleKeyDown,
        className: className },
      _React2['default'].createElement(
        'button',
        {
          id: this.state.id,
          ref: 'button',
          className: 'react-select-box',
          onClick: this.toggleOpenClose,
          onBlur: this.handleBlur,
          tabIndex: '0',
          'aria-hidden': true
        },
        _React2['default'].createElement(
          'div',
          { className: 'react-select-box-label' },
          this.label()
        )
      ),
      this.renderOptionMenu(),
      this.renderClearButton(),
      this.renderNativeSelect()
    );
  },

  renderNativeSelect: function renderNativeSelect() {
    var id = this.state.id + '-native-select';
    var multiple = this.isMultiple();
    var empty = multiple ? null : _React2['default'].createElement(
      'option',
      { key: '', value: '' },
      'No Selection'
    );
    var options = [empty].concat(this.props.children);
    return _React2['default'].createElement(
      'div',
      { className: 'react-select-box-native' },
      _React2['default'].createElement(
        'label',
        { htmlFor: id },
        this.props.label
      ),
      _React2['default'].createElement(
        'select',
        {
          id: id,
          multiple: multiple,
          value: this.props.value || (multiple ? [] : ''),
          onChange: this.handleNativeChange },
        options
      )
    );
  },

  renderOptionMenu: function renderOptionMenu() {
    var className = 'react-select-box-options';
    if (!this.state.open) {
      className += ' react-select-box-hidden';
    }
    /*
    var active = null
    if (this.state.focusedIndex !== -1) {
      active = this.state.id + '-' + this.state.focusedIndex
    }
    */
    return _React2['default'].createElement(
      'div',
      {
        className: className,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        'aria-hidden': true,
        ref: 'menu',
        tabIndex: 0
      },
      _React2['default'].createElement(
        'div',
        { className: 'react-select-box-off-screen' },
        this.options().map(this.renderOption)
      ),
      this.renderCloseButton()
    );
  },

  renderOption: function renderOption(option, i) {
    var className = 'react-select-box-option';
    if (i === this.state.focusedIndex) {
      className += ' react-select-box-option-focused';
    }
    if (this.isSelected(option.value)) {
      className += ' react-select-box-option-selected';
    }
    return _React2['default'].createElement(
      'a',
      {
        id: this.state.id + '-' + i,
        href: '#',
        onClick: this.handleChange(option.value),
        onMouseDown: this.handleMouseDown,
        className: className,
        tabIndex: -1,
        key: option.value,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus
      },
      option.label
    );
  },

  renderClearButton: function renderClearButton() {
    if (this.hasValue()) {
      return _React2['default'].createElement('button', {
        className: 'react-select-box-clear',
        'aria-hidden': true,
        onClick: this.handleClear });
    }
  },

  renderCloseButton: function renderCloseButton() {
    if (this.isMultiple() && this.props.closeText) {
      return _React2['default'].createElement(
        'button',
        {
          onClick: this.handleClose,
          className: 'react-select-box-close',
          onBlur: this.handleBlur,
          onFocus: this.handleFocus },
        this.props.closeText
      );
    }
  }
});

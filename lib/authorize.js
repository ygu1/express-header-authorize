"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLdapauth = _interopRequireDefault(require("passport-ldapauth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ldapAuth = function ldapAuth(username, password) {
  return new Promise(function (resolve) {
    _passport["default"].authenticate('ldapauth', function (err, user) {
      if (err || !user) {
        return resolve({
          active: false
        });
      }

      return resolve(Object.assign({}, user, {
        active: true
      }));
    })({
      query: {
        username: username,
        password: password
      }
    });
  });
};

var Authorize =
/*#__PURE__*/
function () {
  function Authorize(_ref) {
    var ldapConfig = _ref.ldapConfig,
        accesstokenConfig = _ref.accesstokenConfig;

    _classCallCheck(this, Authorize);

    // load ldap config
    if (ldapConfig) {
      if (!ldapConfig.url) throw new Error('Ldap configuration requires a url');
      if (!ldapConfig.searchBase) throw new Error('Ldap configuration requires a searchBase');
      if (!ldapConfig.searchFilter) throw new Error('Ldap configuration requires a searchFilter');
      this.ldapConfig = {
        url: ldapConfig.url,
        searchBase: ldapConfig.searchBase,
        searchFilter: ldapConfig.searchFilter
      };
      var strategy = new _passportLdapauth["default"]({
        server: {
          url: this.ldapConfig.url,
          searchBase: this.ldapConfig.searchBase,
          searchFilter: this.ldapConfig.searchFilter
        }
      });

      _passport["default"].use(strategy);
    } else {
      this.ldapConfig = null;
    } // load accesstoken config


    if (accesstokenConfig) {
      if (!accesstokenConfig.url) throw new Error('Accesstoken configuration requires a url');
      if (!accesstokenConfig.clientId) throw new Error('Accesstoken configuration requires a client ID');
      if (!accesstokenConfig.clientSecret) throw new Error('Accesstoken configuration requires a client secret');
      this.accesstokenConfig = {
        url: accesstokenConfig.url,
        clientId: accesstokenConfig.clientId,
        clientSecret: accesstokenConfig.clientSecret
      };
    } else {
      this.accesstokenConfig = null;
    }

    if (!this.ldapConfig && !this.accesstokenConfig) throw new Error('Please provide at least one configuration');
  }

  _createClass(Authorize, [{
    key: "authorizeWithAccesstoken",
    value: function () {
      var _authorizeWithAccesstoken = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(accesstoken) {
        var option;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (this.accesstokenConfig) {
                  _context.next = 3;
                  break;
                }

                throw new Error('Please provide accesstoken configuration before use it');

              case 3:
                if (accesstoken) {
                  _context.next = 5;
                  break;
                }

                throw new Error('Accesstoken cannot be empty');

              case 5:
                option = {
                  method: 'POST',
                  url: this.accesstokenConfig.url,
                  form: {
                    token: accesstoken,
                    client_id: this.accesstokenConfig.clientId,
                    client_secret: this.accesstokenConfig.clientSecret
                  },
                  json: true
                };
                _context.next = 8;
                return (0, _requestPromise["default"])(option);

              case 8:
                return _context.abrupt("return", _context.sent);

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      function authorizeWithAccesstoken(_x) {
        return _authorizeWithAccesstoken.apply(this, arguments);
      }

      return authorizeWithAccesstoken;
    }()
  }, {
    key: "authorizeWithBasicAuth",
    value: function () {
      var _authorizeWithBasicAuth = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(basicAuth) {
        var credentials, _credentials$split, _credentials$split2, username, password, data;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (this.ldapConfig) {
                  _context2.next = 3;
                  break;
                }

                throw new Error('Please provide ldap configuration before use it');

              case 3:
                if (basicAuth) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('Basic Auth cannot be empty');

              case 5:
                credentials = Buffer.from(basicAuth.split(' ')[1], 'base64').toString();
                _credentials$split = credentials.split(':'), _credentials$split2 = _slicedToArray(_credentials$split, 2), username = _credentials$split2[0], password = _credentials$split2[1];
                _context2.next = 9;
                return ldapAuth(username, password);

              case 9:
                data = _context2.sent;
                return _context2.abrupt("return", Object.assign({}, data, {
                  sub: username
                }));

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](0);
                throw _context2.t0;

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 13]]);
      }));

      function authorizeWithBasicAuth(_x2) {
        return _authorizeWithBasicAuth.apply(this, arguments);
      }

      return authorizeWithBasicAuth;
    }()
  }]);

  return Authorize;
}();

exports["default"] = Authorize;
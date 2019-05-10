Introduction
============

Prohibit click-tracking, and prevent url redirection when clicks on the result links in Google search page.  Forked from the [original version](https://github.com/kodango/Remove-Google-Redirection) to support Safari App Extension model.

This fork does not maintain the code for the legacy Safari extension, nor the extensions for the other browsers.  For any issues in those parts, please use the upstream version instead.

Browser Support
===============

* Apple Safari

Ported extension to the new Safari App Extension API, for use with macOS 10.14 Mojave or Safari Technology Preview 58 on macOS 10.13 High Sierra.

Compile the .xcodeproj.  Go into `Preferences -> Extensions` and turn on the new App Extension.  The rest of the code should be unchanged from the legacy `.safariextz`.

Pre-compiled versions are available from the repo's Github [releases page](https://github.com/yimingliu/Remove-Google-Redirection/releases)

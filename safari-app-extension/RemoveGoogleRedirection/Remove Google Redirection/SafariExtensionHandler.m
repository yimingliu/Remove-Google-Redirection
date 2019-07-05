//
//  SafariExtensionHandler.m
//  Remove Google Redirection
//
//  Created by Yiming Liu on 6/13/18.
//  Copyright © 2018 Yiming Liu. All rights reserved.
//

#import "SafariExtensionHandler.h"
#import "SafariExtensionViewController.h"

@interface SafariExtensionHandler ()

@end

@implementation SafariExtensionHandler

- (void)messageReceivedWithName:(NSString *)messageName fromPage:(SFSafariPage *)page userInfo:(NSDictionary *)userInfo {
    // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
    [page getPagePropertiesWithCompletionHandler:^(SFSafariPageProperties *properties) {
        if ([messageName isEqualToString:@"get-preferences"])
        {
            [page dispatchMessageToScriptWithName:@"got-preferences" userInfo:[self preferencesFromDefaults]];
        }
//        NSLog(@"The extension received a message (%@) from a script injected into (%@) with userInfo (%@)", messageName, properties.url, userInfo);
    }];
}

- (NSDictionary *)preferencesFromDefaults
{
    NSDictionary *preferences = [[NSDictionary alloc] initWithObjectsAndKeys:
     [[self sharedUserDefaults] objectForKey:@"disableForImages"],  @"disableForImages",
     nil];
    return preferences;
}
//
//- (void)toolbarItemClickedInWindow:(SFSafariWindow *)window {
//    // This method will be called when your toolbar item is clicked.
//    NSLog(@"The extension's toolbar item was clicked");
//}
//
//- (void)validateToolbarItemInWindow:(SFSafariWindow *)window validationHandler:(void (^)(BOOL enabled, NSString *badgeText))validationHandler {
//    // This method will be called whenever some state changes in the passed in window. You should use this as a chance to enable or disable your toolbar item and set badge text.
//    validationHandler(YES, nil);
//}

- (SFSafariExtensionViewController *)popoverViewController {
    return [SafariExtensionViewController sharedController];
}

- (NSUserDefaults *)sharedUserDefaults
{
    static NSUserDefaults *defaults;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        defaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.yimingliu.remove-google-redirection"];
        NSDictionary *appDefaults = @{
                                      @"disableForImages" : @NO
                                      };
        [defaults registerDefaults:appDefaults];
    });
    return defaults;
}

@end

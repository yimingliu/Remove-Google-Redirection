//
//  SafariExtensionViewController.h
//  Remove Google Redirection
//
//  Created by Yiming Liu on 6/13/18.
//  Copyright © 2018 Yiming Liu. All rights reserved.
//

#import <SafariServices/SafariServices.h>

@interface SafariExtensionViewController : SFSafariExtensionViewController

+ (SafariExtensionViewController *)sharedController;

@end

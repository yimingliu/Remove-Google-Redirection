//
//  ViewController.m
//  RemoveGoogleRedirection
//
//  Created by Yiming Liu on 6/13/18.
//  Copyright © 2018 Yiming Liu. All rights reserved.
//

#import "ViewController.h"

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    NSUserDefaults* defaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.yimingliu.remove-google-redirection"];
    NSDictionary *appDefaults = @{
                                  @"disableForImages" : @NO,
                                  @"restoreOldSERP" : @NO
                                  };
    [defaults registerDefaults:appDefaults];
    NSUserDefaultsController *defaultsController = [[NSUserDefaultsController alloc] initWithDefaults:defaults initialValues:appDefaults];
    [disableForImageSearch bind:@"value"
                       toObject:defaultsController
           withKeyPath:@"values.disableForImages"
               options:[NSDictionary dictionaryWithObject:[NSNumber numberWithBool:YES]
                                                forKey:@"NSContinuouslyUpdatesValue"]];
    [restoreOldSERP bind:@"value"
                       toObject:defaultsController
           withKeyPath:@"values.restoreOldSERP"
               options:[NSDictionary dictionaryWithObject:[NSNumber numberWithBool:YES]
                                                forKey:@"NSContinuouslyUpdatesValue"]];
    // Do any additional setup after loading the view.
}


- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

    // Update the view, if already loaded.
}


@end

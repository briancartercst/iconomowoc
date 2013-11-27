/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });

router.resource('groups');
router.resource('challenges');

router.get('/users/:id/addsteps').to('users.addSteps');
router.get('/users/:id/walk').to('users.walk');
router.get('/users/:id/multisteps').to('users.addMultiSteps');
router.post('/users/:id/createmultisteps').to('users.createMultiSteps');
router.get('/groups/:id/walk').to('groups.walk');
router.get('/users/:id/getsteps(.:format)').to('users.getSteps');
router.get('/groups/:id/getsteps(.:format)').to('groups.getSteps');
router.get('/groups/:id/addusers(.:format)').to('groups.addUsersToGroup');
router.post('/users/:id/createsteps').to('users.createSteps');
router.post('/groups/:id/linkusers').to('groups.addUsers');

//router.get('/admin/users').to('adminusers.index');

router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.post('/auth/local').to('Auth.local');
router.get('/auth/twitter').to('Auth.twitter');
router.get('/auth/twitter/callback').to('Auth.twitterCallback');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');
router.get('/auth/yammer').to('Auth.yammer');
router.get('/auth/yammer/callback').to('Auth.yammerCallback');
router.resource('users');
router.resource('adminusers');
router.resource('admingroups');
router.resource('adminchallenges');
exports.router = router;

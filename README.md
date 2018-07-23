The Challenge

We're building a multi-player, networked Pong game using React Native. This is a pretty ambitious goal, so let's unpack that a bit. We'll have to:

Create a simple 2 dimensional physics engine for the game
Animate the game-play itself, and design user controls that work well on a mobile phone
Find a way for players to find an opponent online 
Send data back and forth between the 2 players (possibly with a server app in between)
This all means we need at least 2 components to this game: 1) a React Native app, and 2) a server app. 

The Challenge this week is all about getting up and running with the development environments, and building the basic plumbing for the game. 

To keep things simple, and because this is actually a great use for it, we're going to use Node.JS for our server. We'll use Cloud9 as the IDE (Integrated Development Environment) for the server, and host it on AWS. Each mob will share a Cloud9 / EC2 instance, and everydev is sponsoring it. 

For the React Native app, we recommend that each mob uses Visual Studio Code today. 

Step-by-step Challenge for today:

- Set up a Cloud9 instance and create a simple Node server
- Create a REST function called Hello, and have it return "Hi"
- Create a web socket server (in Node) that returns "pong" if you send it "ping"
- Create a React Native app that:
- Connects to the server, calls the REST Hello function, and displays the results on the screen
- Connects to the web socket, sends "pong" to the server, and displays any message it receives from the server on the screen

Bonus Challenges:

Debug the React Native in the simulator by setting a break point and stepping through the code
Do the same, but "on target", ie. on a mobile device connected to your development machine
Start by...
Registering for 1618, so we can create you an everydev gitlab account and track your progress:

https://www.everydev.com/1618-registration/ 

After you register, we'll send you an invite to create a gitlab account. 

Once you have created a gitlab account, you should have access to the Pong repo here:

https://git.everydev.com/1618/pong
# General notes about code and style

This is a code and style review, it has nothing to do with the overall logic or styling but with notation and possible misunderstandings in the usage of modisms and nomenclature.

It is not a functionality revision neither a logic or detailed observation but more like an overall check to exemplify future issues with vocabulary and eloquent Javascript (yes, it is written with lowercase _s_ because **JavaScript** is the trademark name of an implementation while Javascript, javascript or JS is the specification name, or well, kind of specification name, more on that later).

## First things first

As I mentioned before, JavaScript/Javascript/javascript/JS are kind of the same thing but not exactly at the same time; they could have different meanings and very deep meanings if you want to be 'pedantic', this is important if you want to get more into details and history but for now let's say they are the same.

You may already know NodeJS (the popular server side JS engine) is based in Google's V8 JS engine, and I said 'based on' and not 'made of' because they took the source code and forked as they wanted or feel needed. This engine needed to be modifyed for many reasons through time, one of those is the inherently difference between Web and non-Web environments (for example, file paths and computer environment) and to do so, they had to add a few things to the 'engine':

 * New 'extension module' mechanism
 * New syntax to use and load those modules

This is going to be clearer very soon (or why I mentioned those two things right now), let's say it is one of those things are going to bite you back pretty soon in the near future.

## Javascript concise and short history

At the beginning there was Netscape and they decided to make the web interactive and created JavaScript in just 10 days as a simple scripting language using ideas from Scheme (and named it after their devil form, Java and gave the trademark to Sun Microsystems). They see everything was awesome and decided to create JavaScript 1.1

Everybody liked it, they added snowflakes in their webpages as well as marquee effects and things and people were happy with ugly 90's pages.

Then, somebody said, hey, I can do that, and created VBScript. Nobody used it. PERIOD.

Because the hot thing was JavaScript, it was sensible to take the language and create a "clone", a "nice" clone. They did, and called it JScript.

JScript was ok, not that bad to be honest, in fact, they solved a few issues with the language. For example, removed the difference between true enumerables and fake enumerables:

```js
a = [];
a.push(1);
a.push(2);

count = a.length; // it is 2 in JavaScript, 3 in JScript because it counts 'length'
```

Everybody wanted a piece of that, so they decided to create their 'own' better implementation. 
To avoid a bloodshed, they decided to go standard and created ECMAScript 1.0 which was just a rough implementation of what JavaScript 1.3 was without the 'layers' approach by Netscape. ECMAScript 2.0 was just a revision of 1.0 with some style changes in the document to be an ISO spec.

The problem was that not even Netscape was happy with the implementation because it was 'old' and well, a language designed to be a scripting language and not a multipurpose language and, you know, everybody was using classes and all that nice things so they wanted to be cool; so they decided to fuck everybody and do their own thing without asking.

Even Macromedia, a big competitor in those days, decided to do their own thing and came with an implementation (later open sourced and donated to Mozilla, known as Tamarin) and decided to go forward with a _new_ Javascript (yes, now they decided to use that spelling) to rule them all. 

Sadly that version _was not compatible at all_ with previous versions, and when I say _not compatible_ oh boy I really mean it. It used interfaces, classes, removed function scope, added namespaces, in fact it was a _completely different_ language not similar in any sense to the original language.

Now, you may be familiar with things like C# 7.0 and 6.0 and think, hey that is not a big deal and suck it up princess, but when I say not similar at all I say that it will be like asking you to stop coding in C# right now and move to F#, yes, of course it will be fucking awesome but you will be pretty much fucked in the ass with the conversion.

The 'guy' who designed and made Javascript (remember? in 10 days?), Dough _The Machine_ Crockford came and stepped up and say "hey you, you are crazy bastards" and opposed with such a drastic change for ECMAScript 4.0 and sided up with the only guys in those days who were actually too busy making money to actually think about awesome things, Microsoft.

They had they own version, but hey, making a language was too much work, so they decided to just _patch_ the language and add a few things to make the language cool, so instead of doing a big jump to 4.0 they were proposing a simplifier version named 3.1

Crockford was all like "yeah, I like this, compatible, still crappy as I want and all that stuff, I'm all in." and everybody decided to hate each other and it was like the worse part of those Mexican Soap opera when everybody goes crazy and you think 'shit, this tv show is crap'.

You know when Christmas is there and you feel like a nice person and listen to Christmas music and think "hey, I should do the right thing and spread more love" and all that hippy stuff? well, that happened with JS. They got all together in amazing Oslo (I cannot blame them, that place is awesome) and decided all love and no wars.

They decided to scrap all that crazy idea of ECMAScript 4.0 and move forward to 5.0, making 5.0 just a copy of Javascript 3.1 (yes, the Microsoft version) and from now on, modify the language in such a way it will be nicer and less full of weird crap.

So... The Javascript that you use everyday and when you need to add `"use strict";` at the beginning is called ECMAScript 5.0 or **Harmony** because it was love between all the parts in Oslo... So romantic!

## Return to the main part

All that story thanks to be sick from Flu (thanks New Years Eve) and probably too many painkillers. The point is, NodeJS "harmony" parameter is not actually ES6 neither ES5 but it is just a flag for "experimental not yet ready or in process" features.

For example, the addition to `let` and `const` are all ES6 features, the same as _arrow functions_, classes, and some other things (some of those are language specific, like arrows, while another are about runtime behaviour, like tail call optimisations). So far, _the only NodeJS version kind of fully supporting ES6_ is Node 6.5, before that it is just a damn awful dialect.

So, it is fair to say that Node JS is _kind of_ ES6, yes, you maybe be kicked out a party saying that, but you know you are right! In fact, there is a **big main difference** between Node JS dialect and ES6: _modules_.

## Modules, the sad part

Yes, in C you do awesome things like `#include <stdio.h>` and that is all. You know there are semantic differences between doing `#include <stdio.h>` and `#include "stdio.h"` but guess what, this is not C, this is JAVASCRIPT!

Nobody could agree how to do this import thing, because there are a few semantic differences in the way to do something as simple as import a module, overall two main schools were created: CommonJS and AMD (Asynchronous Module Definition, not AMD the manufacturer).

In short, we can describe those things in a few statements or facts:

 * in Node, `require` is a function and `exports` a special object added to the runtime
 * in Node, they were designed to be synchronous by nature because server side
 * in Node, they are dynamic "declarations" (because they are functions and objects) so they can be dynamically called
 * in Node, you cannot fully decide what to do or how to handle the import

 ECMAScript 6 uses a sort of different approach than the `require` keyword, instead of:

 ```js
const express = require('express'),
      app     = express();
```

You will do something like this:

```js
import express from 'Express';

let app = express();
```

The ES6 declaration is static, hoisted and readonly. This is very different than the dynamic nature of the require declaration. Warning!

Node is still thinking how to mix both worlds, and 7.0 will bring just love and understanding to all the parts.

## So what?

Well, if you fully want to use ES6 and beyond, at least you are using Node 7.0 in the server side you have to go with Babel and stuff like that (and Babel for the client side because remember your grandma's browser).

Usually when you say 'it is in ES6' I am pretty sure you mean "It is Node using `const` and `let` syntax", so be carefull with it. I prefer to think 'It is made in Node Harmony'.

## Final Note, about Grunt

Nobody should use Grunt, period. Move to a stream based build system like Gulp or when you grow up and get some chest hair, go and move to Webpack and babel.

## What if I want more awesome things instead of this sillyness?

Move to Babel, or even better, to something like TypeScript 2.x, it is like coding in the future.

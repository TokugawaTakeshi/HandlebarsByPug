# Handlebars by Pug

[Pug mixins](https://pugjs.org/language/mixins.html) for the outputting of the [Handlebars](https://handlebarsjs.com/guide/) code instead of plain HTML.

+ [Installation](#installation)
+ [Functionality](#functionality)
  + [Works with Plain Handlebars](#works-with-plain-handlebars)
    + [Conditionals](#conditionals)
      + [`If--Handlebars`](#if--handlebars)
      + [`Else--Handlebars`](#else--handlebars)
      + [`ElseIf--Handlebars`](#elseif--handlebars)
    + [`Each--Handlebars`](#each--handlebars)
      + [Custom Iterable Context Variable Name](#custom-iterable-context-variable-name)
      + [Custom Iterable Context Variable Name and Index Variable Name](#custom-iterable-context-variable-name-and-index-variable-name)
    + [`With--Handlebars`](#with--handlebars)
      + [Basic Usage](#basic-usage) 
      + [Conditional Usage](#conditional-usage)
    + [Depends on @yamato-daiwa/handlebars-extensions](#depends-on-yamato-daiwahandlebars-extensions)
      + [Conditionals](#conditionals-1)
        + [`IfNonEmptyArray--Handlebars`](#ifnonemptyarray--handlebars) 
        + [`IfNonEmptyObject--Handlebars`](#ifnonemptyobject--handlebars)
        + [`Switch--Handlebars`/`Case--Handlebars`](#switch--handlebarscase--handlebars)
      + [For String Values](#for-string-values)
        + [`AreStringsEqual--HandlebarsHelper`](#arestringsequal--handlebarshelper-)
      + [For Numeric Values](#for-numeric-values)
        + [`IfGreaterThan--Handlebars`](#ifgreaterthan--handlebars)
        + [`IfSmallerThan--Handlebars`](#ifsmallerthan--handlebars)

  
## Installation

```bash
npm i handlebars-by-pug -D -E
```


## Functionality

### Works with Plain Handlebars

#### Conditionals

##### `If--Handlebars`

```pug
dl

  dt.UserProfile-Profile-KeyCell Full Name
  dd.UserProfile-Profile-ValueCell {{ fullName }}

  +If--Handlebars("phoneNumber")
    dt.UserProfile-Profile-KeyCell Phone number
    dd.UserProfile-Profile-ValueCell {{ phoneNumber }}
```

Output (formatted):

```handlebars
<dl>
    
  <dt class="UserProfile-Profile-KeyCell">Full Name</dt>
  <dd class="UserProfile-Profile-ValueCell">{{ fullName }}</dd>
    
  {{#if phoneNumber}}
    <dt class="UserProfile-Profile-KeyCell">Phone number</dt>
    <dd class="UserProfile-Profile-ValueCell">{{ phoneNumber }}</dd>
  {{/if}}
    
</dl>
```

###### `Else--Handlebars`

> ⚠️ **Warning:** The `+Else--Handlebars` mixin invocation must be _below_ `+If--Handlebars` level.

❌ **Wrong**:

```pug
dl
  
  dt.UserProfile-Profile-KeyCell Phone number
  dd.UserProfile-Profile-ValueCell
    +If--Handlebars("phoneNumber")
      | {{ phoneNumber }} 
    +Else--Handlebars
      | (No specified)
```

✅ **Correct**:

```pug
dl
  
  dt.UserProfile-Profile-KeyCell Phone number
  dd.UserProfile-Profile-ValueCell
    +If--Handlebars("phoneNumber")
      | {{ phoneNumber }} 
      +Else--Handlebars
        | (No specified)
```

Output (formatted):

```handlebars
<dl>

  <dt class="UserProfile-Profile-KeyCell">Phone number</dt>
  <dd class="UserProfile-Profile-ValueCell">
    {{#if phoneNumber}}
      {{ phoneNumber }} 
    {{else}}
      (No specified)
    {{/if}}
  </dd>

</dl>
```

###### `ElseIf--Handlebars`

> ⚠️ **Warning:** Similarly to `+Else--Handlebars`, the `ElseIf--Handlebars` mixin invocation must be _below_ 
>   `+If--Handlebars` level. Also, each nested `ElseIf--Handlebars` or `+Else--Handlebars` must be in level deeper
>   than the previous one.

❌ **Wrong**:

```pug
+If--Handlebars("conditionA")

  | Condition A is true

+ElseIf--Handlebars("conditionB")

  | Condition B is true

+ElseIf--Handlebars("conditionC")

  | Condition C is true

+Else--Handlebars

  | No condition matched
```

✅ **Correct**:

```pug
+If--Handlebars("conditionA")

  | Condition A is true

  +ElseIf--Handlebars("conditionB")

    | Condition B is true

    +ElseIf--Handlebars("conditionC")

      | Condition C is true

      +Else--Handlebars

        | No condition matched
```

Output (formatted):

```handlebars
{{#if conditionA}}
  Condition A is true
{{else}}
  {{#if conditionB}}
    Condition B is true
  {{else}}
    {{#if conditionC}}
      Condition C is true
    {{else}}
      No condition matched
    {{/if}}
  {{/if}}
{{/if}}
```


#### `Each--Handlebars`

##### Basic Usage

```pug
ul

  +Each--Handlebars("items")
  
    li {{ this }}
```

Output (formatted):

```handlebars
<ul>
  {{#each items}}
    <li>{{ this }}</li>
  {{/each}}
</ul>
```


#### Custom Iterable Context Variable Name

```pug
ul

  +Each--Handlebars({ iterableVariableName: "items", iterableContextVariableName: "item" })
  
    li {{ item }}
```

Output (formatted):

```handlebars
<ul>
  {{#each items as |item|}}
    <li>{{ item }}</li>
  {{/each}}
</ul>
```


#### Custom Iterable Context Variable Name and Index Variable Name


```pug
ul

  +Each--Handlebars({ 
    iterableVariableName: "items", 
    iterableContextVariableName: "item",
    indexVariableName: "itemIndex"
  })
  
    li {{ itemIndex }}: {{ item }}
```

Output (formatted):

```handlebars
<ul>
  {{#each items as |item itemIndex|}}
    <li>{{ itemIndex }}: {{ item }}</li>
  {{/each}}
</ul>
```

> ⚠️ **Warning:** Please note that only mentioned above combinations of properties of object-type parameter are valid.
> The error will be thrown is any other combination will be specified.


#### `With--Handlebars`
##### Basic Usage

```pug
+With--Handlebars("user")

  | {{firstname}} {{lastname}}
```

Output (formatted):

```handlebars
{{#with person}}
  {{firstname}} {{lastname}}
{{/with}}
```

##### Conditional Usage

The `with`-statement can ba conditionally generated or no.
Such functionality demanded in cases when developing the Pug component it is unknown at advance on which depth level 
  desired variable will be.
In below example we are not know will be the `"user"` variable on current level or it will be the context: 
  

```pug
mixin UserEditor(options)

  -
  
    const {
    
      /** @type { string | undefined } */
      userTemplateDataVariableName
    
    } = options ?? {};

  +With--Handlebars({
    mustSurroundByWithHelperIf: typeof userTemplateDataVariableName !== "undefined",
    parameterName: userTemplateDataVariableName
  })
  
    | {{firstname}} {{lastname}}
```

Output for `userTemplateDataVariableName` with `"user"` value (formatted):

```Handlebars
{{#with user}}
  {{firstname}} {{lastname}}
{{/with}}
```

Output for `userTemplateDataVariableName` with `undefined` value (formatted):

```Handlebars
{{firstname}} {{lastname}}
```


### Depends on `@yamato-daiwa/handlebars-extensions`

To make it work, install [@yamato-daiwa/handlebars-extensions](https://www.npmjs.com/package/@yamato-daiwa/handlebars-extensions)
  and enable desired helpers.

```bash
npm i @yamato-daiwa/handlebars-extensions -E
```

#### Conditionals
##### `IfNonEmptyArray--Handlebars`

Depends on [`IsNonEmptyArrayHandlebarsHelper `/`isNonEmptyArray`](https://www.npmjs.com/package/@yamato-daiwa/handlebars-extensions#isnonemptyarrayhandlebarshelper--isnonemptyarray).

Unlike JavaScript, is conditional statements Handlebars considers the empty array as `false`.
If you are fine with it, maybe you don't need this helper.
And if you want to express "I am expecting either non-empty or empty array but nothing more", you can use this helper:

```Pug
+IfNonEmptyArray--Handlebars("items")

  ul

    +Each--Handlebars("items")
  
      li {{ this }}
```

Output (formatted):

```Handlebars
{{#isNonEmptyArray items}}
  <ul>
    {{#each items}}
      <li>{{ this }}</li>
    {{/each}}
  </ul>
{{/isNonEmptyArray}}
```


##### `IfNonEmptyObject--Handlebars`

Depends on [`IsNonEmptyObjectHandlebarsHelper`/`isNonEmptyObject`](https://www.npmjs.com/package/@yamato-daiwa/handlebars-extensions#isnonemptyobjecthandlebarshelper--isnonemptyobject).

```pug
dl

  +IfNonEmptyObject--Handlebars("socialNetworkProfilesURIs")
    dt Social networks
    dd 
      ul
        +Each--Handlebars("socialNetworkProfilesURIs")
          li {{@key}}
```

Output (formatted):

```html
<dl>
  {{#isNonEmptyObject socialNetworkProfilesURIs}}
    <dt>Social networks</dt>
    <dd>
      <ul>
        {{#each socialNetworkProfilesURIs}}
          <li>{{@key}}</li>
        {{/each}}
      </ul>
    </dd>
  {{/isNonEmptyObject}}
</dl>
```


##### `Switch--Handlebars`/`Case--Handlebars`

Depends on [`SwitchCaseHandlebarsHelpers`](https://www.npmjs.com/package/@yamato-daiwa/handlebars-extensions#switchcasehandlebarshelpers--switch--case).

```pug
+Switch--Handlebars("dayOfWeekNumber__numerationFrom0AsSunday")

  +Case--Handlebars(0)

    | Sunday

  +Case--Handlebars(1)

    | Monday

  +Case--Handlebars(2)

    | Tuesday

  +Case--Handlebars(3)

    | Wednesday

  +Case--Handlebars(4)

    | Thursday

  +Case--Handlebars(5)

    | Friday

  +Case--Handlebars(6)

    | Saturday
```

Output (formatted):

```handlebars
{{#switch dayOfWeekNumber__numerationFrom0AsSunday}}
  {{#case 0}}Sunday{{/case}}
  {{#case 1}}Monday{{/case}}
  {{#case 2}}Tuesday{{/case}}
  {{#case 3}}Wednesday{{/case}}
  {{#case 4}}Thursday{{/case}}
  {{#case 5}}Friday{{/case}}
  {{#case 6}}Saturday{{/case}}
{{/switch}}
```


#### For String Values

##### `AreStringsEqual--HandlebarsHelper` 

```pug
ul
  
  +Each--Handlebars("socialNetworkProfilesURIs")
    
    li

      +AreStringsEqual--HandlebarsHelper("@key", "facebook")
        a(href=`{{ this }}`)
          svg
            // The SVG code of teh Facebook icon ...

      +AreStringsEqual--HandlebarsHelper("@key", "instagram")
        a(href=`{{ this }}`)
          svg
            // The SVG code of teh Instagram icon ...

      +AreStringsEqual--HandlebarsHelper("@key", "twitter")
        a(href=`{{ this }}`)
          svg
            // The SVG code of teh Twitter icon ...
```

Output (formatted):

```handlebars
<ul>
     
  {{#each socialNetworkProfilesURIs}}
     
    <li>
        
      {{#areStringsEqual @key "facebook"}}
        <a href="{{ this }}">
          <svg>
            <!-- The SVG code of teh Facebook icon ... -->
          </svg>
        </a>
      {{/areStringsEqual}}
           
      {{#areStringsEqual @key "instagram"}}
       <a href="{{ this }}">
        <svg>
          <!-- The SVG code of teh Instagram icon ...-->
        </svg>
       </a>
      {{/areStringsEqual}}
        
      {{#areStringsEqual @key "twitter"}}
        <a href="{{ this }}">
          <svg>
            <!-- The SVG code of teh Twitter icon ...-->
          </svg>
        </a>
      {{/areStringsEqual}}
        
    </li>
  
  {{/each}}
    
</ul>
```

#### For Numeric Values

##### `IfGreaterThan--Handlebars`

```pug
+IfGreaterThan--Handlebars("user.warnings_count", "USER_WARNINGS_LIMIT")

  div Sorry, you are unable to post the messages because of warnings limit.  
```

Output (formatted):


```Handlebars
{{#isGreaterThan user.warnings_count USER_WARNINGS_LIMIT}}
  <div>Sorry, you are unable to post the messages because of warnings limit.</div>
{{/isGreaterThan}}
```

##### `IfSmallerThan--Handlebars`

```pug
+IfSmallerThan--Handlebars("user.karmaPoints", "USER_MINIMAL_KARMA_POINTS_FOR_POSTING")

  div Sorry, you are unable to post the messages because of warnings limit.  
```

Output (formatted):

```Handlebars
{{#isSmallerThan user.warnings_count USER_WARNINGS_LIMIT}}
  <div>Sorry, you are have not enough karma points to post the message. Please increase the karma points and come back.</div>
{{/isSmallerThan}}
```

import Pug from "pug";
import Handlebars from "handlebars";
import FileSystem from "fs";


/* [ Execution ] node Tests/Manual/Conditionals/ElseIf/ElseIf.test.mjs */

const pugToHandlebars = Pug.compileFile("Tests/Manual/Conditionals/ElseIf/ElseIf.test.pug");

const handlebarsContent = pugToHandlebars({});

FileSystem.writeFileSync("Tests/Manual/Conditionals/ElseIf/ElseIf.test.hbs", handlebarsContent);

const handlebarsToHTML = Handlebars.compile(handlebarsContent);

FileSystem.writeFileSync(
  "Tests/Manual/Conditionals/ElseIf/ElseIf.test.html",
  handlebarsToHTML({
    conditionA: false,
    conditionB: false,
    conditionC: true
  })
);

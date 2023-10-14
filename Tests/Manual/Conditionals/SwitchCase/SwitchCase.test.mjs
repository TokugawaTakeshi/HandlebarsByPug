import Pug from "pug";
import FileSystem from "fs";
import Handlebars from "handlebars";
import { SwitchCaseHandlebarsHelpers } from "@yamato-daiwa/handlebars-extensions";

/* [ Execution ] node Tests/Manual/Conditionals/SwitchCase/SwitchCase.test.mjs */

Handlebars.registerHelper("switch", SwitchCaseHandlebarsHelpers.switch)
Handlebars.registerHelper("case", SwitchCaseHandlebarsHelpers.case)

const pugToHandlebars = Pug.compileFile("Tests/Manual/Conditionals/SwitchCase/SwitchCase.test.pug");

const handlebarsContent = pugToHandlebars({});

FileSystem.writeFileSync("Tests/Manual/Conditionals/SwitchCase/SwitchCase.test.hbs", handlebarsContent);

const handlebarsToHTML = Handlebars.compile(handlebarsContent);

FileSystem.writeFileSync(
  "Tests/Manual/Conditionals/SwitchCase/SwitchCase.test.html",
  handlebarsToHTML({ dayOfWeekNumber__numerationFrom0AsSunday: 6 })
);

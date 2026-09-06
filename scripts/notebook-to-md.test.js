const test = require('node:test');
const assert = require('node:assert/strict');
const {htmlToMd} = require('./notebook-to-md');

test('keeps table headings and rows together in readable Markdown', () => {
  const md = htmlToMd('<main><table><thead><tr><th>Token</th><th>ID</th></tr></thead><tbody><tr><td>bank</td><td>5</td></tr></tbody></table></main>');
  assert.equal(md, '| Token | ID |\n| --- | --- |\n| bank | 5 |');
});
test('preserves code indentation, angle brackets and literal Markdown fences', () => {
  const md = htmlToMd('<main><pre><b># Example</b>\nif ready:\n    path = "src/&lt;name&gt;/"\n    fence = "```"</pre><div class="code-block">if ready:\n    run()</div></main>');
  assert.ok(md.includes('````\n# Example\nif ready:\n    path = "src/<name>/"\n    fence = "```"\n````'));
  assert.ok(md.includes('```\nif ready:\n    run()\n```'));
  assert.doesNotMatch(md, /<\/?(?:pre|b)>/);
});
test('exports disclosure questions and pattern headings without layout markup', () => {
  const md = htmlToMd('<main><div><span class="pat-no">P1</span><h2>Instructions</h2></div><details><summary>What stays fixed?</summary><p>The saved table.</p></details></main>');
  assert.ok(md.includes('## P1: Instructions'));
  assert.ok(md.includes('### What stays fixed?'));
  assert.ok(md.includes('The saved table.'));
  assert.doesNotMatch(md, /<\/?(?:summary|details)>/);
});

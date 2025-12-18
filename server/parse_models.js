import fs from 'fs';

try {
    const data = fs.readFileSync('models.json', 'utf8');
    const content = data.toString();
    const regex = /"name":\s*"([^"]+)"/g;
    let match;
    const names = [];

    while ((match = regex.exec(content)) !== null) {
        names.push(match[1]);
    }

    console.log("Found models:");
    names.forEach(n => console.log(n));

    fs.writeFileSync('server/model_names.txt', names.join('\n'));

} catch (e) {
    console.error(e);
}

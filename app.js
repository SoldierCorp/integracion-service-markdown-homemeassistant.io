// Dependencies
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// File
const filePath = process.argv[2]
const fileName = filePath.split('.')[0]

try {
    var doc = yaml.safeLoad(fs.readFileSync(path.join(`${__dirname}/yaml-files/${filePath}`), 'utf8'))
    
    let template = ''
    let result = ''
    let listServices = ''
    let services = ''

  _.forEach(doc, function (service, key) {
    listServices += `\`${fileName}.${key}\`, `
  })

  const header = `
## Services

### Fan control services

Available services: ${ listServices }

<div class='note'>

  Not all fan services may be available for your platform. Be sure to check the available services Home Assistant has enabled by checking <img src='/images/screenshots/developer-tool-services-icon.png' alt='service developer tool icon' class="no-shadow" height="38" /> **Services**.
    
</div>

`

  _.forEach(doc, function (service, key) {

    let attrs = ''
    _.forEach(service.fields, function(valueAttr, keyAttr) {
        attrs += `\| \`${keyAttr}\` | no | ${valueAttr.description}\n`
    })

    let exampleData = ''
    _.forEach(service.fields, function (valueAttr, keyAttr) {
      exampleData += `\t  ${keyAttr}: ${valueAttr.example},\n`
    })

    services = `
### Service \`fan.${key}\`

${service.description}

\| Service data attribute | Optional | Description |
\| ---------------------- | -------- | ----------- |
${attrs}

#### Automation example

\`\`\`yaml
automation:
trigger:
  platform: time
  at: "07:15:00"
action:
  - service: fan.${key}
    data:
${exampleData}
\`\`\`

`

  result += services
  })

  template += `
${header}
${result}
  `
  
  fs.writeFileSync(path.join(`${__dirname}/markdown-files/${fileName}.markdown`), template)

} catch (e) {
    console.log(e)
}
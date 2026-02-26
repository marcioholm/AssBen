const fs = require('fs');
const _path = require('path');

function generateFakeCPF() {
    return Math.floor(Math.random() * 90000000000) + 10000000000;
}

const companies = [
    { name: "Supermercado São José", cnpj: "11222333000144" },
    { name: "Posto Avenida", cnpj: "55666777000188" },
    { name: "Farmácia Vida", cnpj: "99888777000166" },
    { name: "Padaria Pão de Mel", cnpj: "44333222000111" },
    { name: "Loja de Roupas Estilo", cnpj: "77666555000133" },
];

const dependentsSuffixes = ["Filho(a)", "Cônjuge", "Enteado(a)"];

let csvContent = "companyCnpj,name,cpf,phone,type,titularCpf\n";

companies.forEach((company) => {
    // 2 Employees per company
    for (let i = 1; i <= 2; i++) {
        const titularCpf = generateFakeCPF().toString();
        const titularPhone = "439" + Math.floor(Math.random() * 90000000) + 10000000;
        const titularName = `Funcionario ${i} da ${company.name}`;

        csvContent += `${company.cnpj},${titularName},${titularCpf},${titularPhone},TITULAR,\n`;

        // 3 Dependents per employee
        for (let j = 0; j < 3; j++) {
            const depCpf = generateFakeCPF().toString();
            const depPhone = "";
            const depName = `Dependente ${j + 1} (${dependentsSuffixes[j]}) de ${titularName}`;

            csvContent += `${company.cnpj},${depName},${depCpf},${depPhone},DEPENDENT,${titularCpf}\n`;
        }
    }
});

const outputPath = _path.join(__dirname, '..', 'empresas-ficticias-acebraz.csv');
fs.writeFileSync(outputPath, csvContent);
console.log(`Gerado CSV de teste com sucesso: ${outputPath}`);

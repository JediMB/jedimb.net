const flipLogo = document.querySelector('#flip-logo');
const logoElements = Array.from(flipLogo.querySelectorAll('rect'));

const logoColumns = [];
for (let col = 0; col < 56; col++) {
    logoColumns.push(logoElements.filter(elem => elem.getAttribute('logo-col') === `${col}`));
}

const logoRows = [];
for (let row = 0; row < 10; row++) {
    logoRows.push(logoElements.filter(elem => elem.getAttribute('logo-row') === `${row}`));
}

const logo = new Map();
logo.set('1 8', 1).set('1 9', 1)
    .set('2 8', 1).set('2 9', 1)
    .set('3 8', 1).set('3 9', 1)
    .set('4 8', 1).set('4 9', 1)
    .set('5 0', 1).set('5 1', 1).set('5 2', 1).set('5 3', 1).set('5 4', 1).set('5 5', 1).set('5 6', 1).set('5 7', 1).set('5 8', 1).set('5 9', 1)
    .set('6 0', 1).set('6 1', 1).set('6 2', 1).set('6 3', 1).set('6 4', 1).set('6 5', 1).set('6 6', 1).set('6 7', 1).set('6 8', 1).set('6 9', 1);
logo.set('9 4', 1).set('9 5', 1).set('9 6', 1).set('9 7', 1).set('9 8', 1)
    .set('10 3', 1).set('10 4', 1).set('10 5', 1).set('10 6', 1).set('10 7', 1).set('10 8', 1).set('10 9')
    .set('11 3', 1).set('11 4', 1).set('11 6', 1).set('11 8', 1).set('11 9')
    .set('12 3', 1).set('12 4', 1).set('12 6', 1).set('12 8', 1).set('12 9')
    .set('13 3', 1).set('13 4', 1).set('13 5', 1).set('13 6', 1).set('13 8', 1).set('13 9')
    .set('14 4', 1).set('14 5', 1).set('14 6', 1).set('14 8', 1);
logo.set('17 5', 1).set('17 6', 1).set('17 7', 1).set('17 8', 1)
    .set('18 4', 1).set('18 5', 1).set('18 6', 1).set('18 7', 1).set('18 8', 1).set('18 9', 1)
    .set('19 4', 1).set('19 5', 1).set('19 8', 1).set('19 9', 1)
    .set('20 4', 1).set('20 5', 1).set('20 8', 1).set('20 9', 1)
    .set('21 0', 1).set('21 1', 1).set('21 2', 1).set('21 3', 1).set('21 4', 1).set('21 5', 1).set('21 6', 1).set('21 7', 1).set('21 8', 1).set('21 9', 1)
    .set('22 0', 1).set('22 1', 1).set('22 2', 1).set('22 3', 1).set('22 4', 1).set('22 5', 1).set('22 6', 1).set('22 7', 1).set('22 8', 1).set('22 9', 1);
logo.set('25 3', 1).set('25 9', 1)
    .set('26 3', 1).set('26 4', 1).set('26 8', 1).set('26 9', 1)
    .set('27 0', 1).set('27 1', 1).set('27 3', 1).set('27 4', 1).set('27 5', 1).set('27 6', 1).set('27 7', 1).set('27 8', 1).set('27 9', 1)
    .set('28 0', 1).set('28 1', 1).set('28 3', 1).set('28 4', 1).set('28 5', 1).set('28 6', 1).set('28 7', 1).set('28 8', 1).set('28 9', 1)
    .set('29 8', 1).set('29 9', 1)
    .set('30 9', 1);
logo.set('33 0', 1).set('33 1', 1).set('33 2', 1).set('33 3', 1).set('33 4', 1).set('33 5', 1).set('33 6', 1).set('33 7', 1).set('33 8', 1).set('33 9', 1)
    .set('34 1', 1).set('34 2', 1).set('34 3', 1).set('34 4', 1).set('34 5', 1).set('34 6', 1).set('34 7', 1).set('34 8', 1).set('34 9', 1)
    .set('35 2', 1).set('35 3', 1).set('35 4', 1)
    .set('36 3', 1).set('36 4', 1).set('36 5', 1)
    .set('37 2', 1).set('37 3', 1).set('37 4', 1)
    .set('38 1', 1).set('38 2', 1).set('38 3', 1).set('38 4', 1).set('38 5', 1).set('38 6', 1).set('38 7', 1).set('38 8', 1).set('38 9', 1)
    .set('39 0', 1).set('39 1', 1).set('39 2', 1).set('39 3', 1).set('39 4', 1).set('39 5', 1).set('39 6', 1).set('39 7', 1).set('39 8', 1).set('39 9', 1);
logo.set('41 0', 1).set('41 1', 1).set('41 2', 1).set('41 3', 1).set('41 4', 1).set('41 5', 1).set('41 6', 1).set('41 7', 1).set('41 8', 1).set('41 9', 1)
    .set('42 0', 1).set('42 1', 1).set('42 2', 1).set('42 3', 1).set('42 4', 1).set('42 5', 1).set('42 6', 1).set('42 7', 1).set('42 8', 1).set('42 9', 1)
    .set('43 0', 1).set('43 1', 1).set('43 4', 1).set('43 5', 1).set('43 8', 1).set('43 9', 1)
    .set('44 0', 1).set('44 1', 1).set('44 4', 1).set('44 5', 1).set('44 8', 1).set('44 9', 1)
    .set('45 0', 1).set('45 1', 1).set('45 2', 1).set('45 3', 1).set('45 4', 1).set('45 5', 1).set('45 6', 1).set('45 7', 1).set('45 8', 1).set('45 9', 1)
    .set('46 1', 1).set('46 2', 1).set('46 3', 1).set('46 4', 1).set('46 6', 1).set('46 7', 1).set('46 8', 1);
logo.set('48 9', 1)
    .set('49 1', 1)
    .set('50 1', 1).set('50 3', 1).set('50 4', 1).set('50 5', 1).set('50 8', 1).set('50 9', 1)
    .set('51 0', 1).set('51 1', 1).set('51 2', 1).set('51 5', 1).set('51 7', 1).set('51 9', 1)
    .set('52 1', 1).set('52 4', 1).set('52 5', 1).set('52 7', 1).set('52 9', 1)
    .set('53 1', 1).set('53 5', 1).set('53 7', 1).set('53 9', 1)
    .set('54 0', 1).set('54 1', 1).set('54 3', 1).set('54 4', 1).set('54 5', 1).set('54 7', 1).set('54 9', 1);

for (let col = 0; col < logoColumns.length; col++) {
    for (let row = 0; row < logoColumns[col].length; row++) {
        logoColumns[col][row].addEventListener('mouseover', () => {
            if (logoColumns[col-1]) {
                logoColumns[col-1][row-1]?.classList.toggle('hovered-corner', true);
                logoColumns[col-1][row]?.classList.toggle('hovered-adjacent', true);
                logoColumns[col-1][row+1]?.classList.toggle('hovered-corner', true);
            }
            if (logoColumns[col+1]) {
                logoColumns[col+1][row-1]?.classList.toggle('hovered-corner', true);
                logoColumns[col+1][row]?.classList.toggle('hovered-adjacent', true);
                logoColumns[col+1][row+1]?.classList.toggle('hovered-corner', true);
            }
            logoColumns[col][row-1]?.classList.toggle('hovered-adjacent', true);
            logoColumns[col][row].classList.toggle('hovered', true);
            logoColumns[col][row+1]?.classList.toggle('hovered-adjacent', true);
            
        });
        logoColumns[col][row].addEventListener('mouseout', () => {
            if (logoColumns[col-1]) {
                logoColumns[col-1][row-1]?.classList.toggle('hovered-corner', false);
                logoColumns[col-1][row]?.classList.toggle('hovered-adjacent', false);
                logoColumns[col-1][row+1]?.classList.toggle('hovered-corner', false);
            }
            if (logoColumns[col+1]) {
                logoColumns[col+1][row-1]?.classList.toggle('hovered-corner', false);
                logoColumns[col+1][row]?.classList.toggle('hovered-adjacent', false);
                logoColumns[col+1][row+1]?.classList.toggle('hovered-corner', false);
            }
            logoColumns[col][row-1]?.classList.toggle('hovered-adjacent', false);
            logoColumns[col][row].classList.toggle('hovered', false);
            logoColumns[col][row+1]?.classList.toggle('hovered-adjacent', false);
        });

        if (logo.has(`${col} ${row}`)) {
            logoColumns[col][row].classList.add('flipped');
        }
    }
}
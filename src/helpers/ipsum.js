
module.exports = function (context) {

    let rows = context.hash.rows === undefined ? 1 : context.hash.rows;

    let ipsumTexts = [
        'Duis fermentum at justo eget dignissim. Aliquam ornare dolor suscipit euismod imperdiet. Donec sed cursus dui. Aliquam porta dolor vitae felis consectetur, nec iaculis velit imperdiet. Fusce ullamcorper ligula sed rutrum efficitur. Fusce bibendum, lorem a placerat condimentum, augue nunc efficitur libero, et iaculis justo massa sit amet odio. Nam non auctor tellus, hendrerit dignissim metus. Quisque ac ultrices ex, et fringilla lacus. Phasellus ut sodales tellus, quis tristique nisl. Duis eget sem id nibh dignissim imperdiet. Sed feugiat elit eget massa vestibulum hendrerit. Mauris nec velit vel erat interdum semper ac id arcu.',
        'Morbi malesuada mauris ut rhoncus rutrum. Nulla mattis imperdiet ex, eu blandit velit posuere ut. Proin eget nibh felis. Nam ut magna quis nisi tincidunt dapibus sit amet mollis dolor. Morbi quis ante dapibus, vulputate lectus a, ultrices sapien. Suspendisse lobortis leo et varius pharetra. Aliquam gravida ipsum in tortor tincidunt eleifend. Nulla tincidunt quam libero, vitae euismod lacus consectetur nec. Aliquam euismod elit lacus, in facilisis ipsum fringilla eget. Etiam vehicula arcu sed volutpat viverra. Duis facilisis urna libero, sed ornare elit scelerisque ac. Donec semper turpis velit, ac luctus est faucibus quis.',
        'Suspendisse porta sem ut blandit accumsan. Etiam fermentum neque sit amet magna consequat posuere. Morbi congue lectus eu volutpat porta. Ut euismod ex lorem, vel tempor metus tristique vitae. Nulla non dapibus arcu, non euismod augue. Nulla vel turpis velit. Nullam mollis laoreet mi in pharetra. Nunc feugiat lacus orci. Phasellus dictum pulvinar leo. Nulla tincidunt massa nec dui pretium vestibulum. Donec at lorem eros. Vestibulum non elit arcu.',
        'Suspendisse vitae mattis risus. Aenean sit amet eros dolor. Aenean tristique, justo eu bibendum tristique, urna ligula hendrerit odio, vitae venenatis arcu lacus at elit. Phasellus non odio pharetra, laoreet mi quis, ultricies est. Praesent vel ullamcorper urna. Etiam et mauris imperdiet, viverra dui id, vulputate est. Sed vel turpis placerat, fringilla sapien sed, pretium tellus. Curabitur tristique urna quis lorem tempor, a sodales ipsum bibendum. Mauris et magna consectetur, eleifend ipsum at, hendrerit nibh. Vestibulum venenatis finibus elit in efficitur.',
        'Vivamus ultrices dictum ligula eget dictum. Fusce erat dolor, hendrerit sit amet tellus quis, pretium lobortis diam. Mauris eget lorem tortor. Sed odio odio, ullamcorper et orci quis, commodo mattis magna. Quisque elementum tellus eu pharetra molestie. Maecenas euismod neque quis eros sodales, eget lacinia tellus fringilla. Proin sit amet vehicula elit. Duis vel nibh id ipsum fringilla tempor. Donec lacinia, lacus vitae facilisis posuere, dolor lacus faucibus justo, vitae tincidunt metus ante non velit. Donec dictum imperdiet dignissim. Maecenas eu lacinia nisi. Aenean lobortis non libero sed laoreet. Nullam a quam euismod turpis congue consequat sit amet et odio.',
        'Praesent ut viverra urna. Morbi laoreet lacus vel auctor varius. Nunc scelerisque, nibh pulvinar finibus elementum, justo metus commodo lorem, malesuada interdum quam leo sed enim. Sed efficitur, tortor at porta pulvinar, neque eros efficitur justo, vitae condimentum sapien nunc sed sapien. Nullam consectetur pretium odio, pharetra euismod nibh facilisis ac. Quisque risus mi, bibendum eget blandit at, finibus nec risus. Nullam porttitor dui in lectus mollis laoreet. In hac habitasse platea dictumst. Fusce ultrices vestibulum sapien vel laoreet. Nullam ac est justo. Fusce sagittis accumsan nibh, et ornare ipsum scelerisque et. Praesent sapien elit, molestie sed pulvinar eu, congue ut nunc. Donec ullamcorper dui et dictum ullamcorper.',
        'Nullam auctor sapien eget nunc feugiat, ut fringilla eros auctor. Integer sem orci, volutpat eget massa quis, iaculis gravida arcu. Sed elementum iaculis egestas. Aenean aliquam vestibulum ante. Ut sit amet viverra nisi, vel rutrum purus. Quisque aliquam tempus nulla, vel pulvinar purus fermentum vel. Maecenas vestibulum libero eu malesuada pharetra. Nullam pretium arcu nulla.',
        'Duis nec tempor justo, a hendrerit nibh. Cras porttitor massa at rhoncus consectetur. Donec auctor nisi fermentum diam fringilla, laoreet mollis quam fermentum. In facilisis scelerisque elit, eget tempus risus eleifend in. Sed lorem diam, maximus nec dolor semper, lacinia lobortis risus. Vivamus eget dictum dolor, quis egestas sem. Sed vulputate dolor eget volutpat dapibus. Etiam ac nibh magna. Nunc tincidunt sit amet lectus sed viverra. Cras pharetra ligula eget turpis tempus congue. Donec sit amet lacus augue. Etiam eget neque tempus, rhoncus mi non, tincidunt metus.',
        'Vivamus facilisis mi ligula, quis vehicula libero iaculis ut. In quis suscipit lorem. Duis sit amet fermentum ex. Quisque convallis porttitor mauris ac iaculis. Nunc nec fermentum nibh. Vestibulum in auctor ex, sit amet vulputate enim. Etiam a mollis augue. Quisque sodales molestie risus id ultrices. Cras tincidunt suscipit sapien, at congue eros accumsan quis. Curabitur lacus turpis, mattis ac tempor at, scelerisque eget velit.',
        'Sed augue nunc, mattis sed sapien vel, accumsan blandit turpis. Morbi vehicula vulputate tellus, non euismod tortor congue eu. Proin pulvinar pharetra laoreet. Ut non porta sem, at interdum erat. Duis euismod neque id suscipit eleifend. Nulla posuere hendrerit magna, et mattis eros. Duis nec mauris sit amet ex bibendum pulvinar non ac massa.'
    ];

    let output = '';

    for (let i = 0; i < rows; i++) {

        let indexToUse = i;

        while (indexToUse > ipsumTexts.length - 1) {
            indexToUse -= ipsumTexts.length - 1;
        }

        output += ipsumTexts[indexToUse] + ' ';
    }

    return output;
};

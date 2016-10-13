<?php

$data = json_decode(file_get_contents('./index.json'), true);

$currentPartyLocation = $data['current']['location'];
$currentPartyXP = $data['current']['partyXp'];

$xpCapPerLevel = $data['xpCapPerLevel'];
$currentPartyLevelName = "1";
$nextLevelName = "?";
$nextLevelXP = null;

foreach ($xpCapPerLevel as $levelIndex => $levelCap) {
  if ($levelCap >= $currentPartyXP) {
    $nextLevelName = (string)($levelIndex + 2);
    $nextLevelXP = $levelCap;
    break;
  }
  $currentPartyLevelName = (string)($levelIndex + 2);
}

$levelProgressPercent = round(($currentPartyXP / $nextLevelXP ) * 100, 2);

$sessionsPlayed = $data['playCounts']['session'];
$oneShotsPlayed = $data['playCounts']['oneShot'];
$totalPlays = $sessionsPlayed + $oneShotsPlayed;

$xpNeededToLevelUp = $nextLevelXP - $currentPartyXP;
$avgXpPerSession = $currentPartyXP / $totalPlays;
$approxSessionsForLevelUp = $xpNeededToLevelUp / $avgXpPerSession;

$tpKillCount = $data['dmKillCounts']['tpk'];
$playerKillCount = $data['dmKillCounts']['player'];

echo '<!DOCTYPE html>'
  . '<html lang="en">'
  . '<head>'
    . '<meta charset="utf-8">'
    . '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
    . '<meta name="viewport" content="width=device-width, initial-scale=1">'
    . '<meta name="description" content="">'
    . '<meta name="author" content="">'
    . '<title>Cult of the Treacherous God</title>'
    . '<link href="/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">'
    . '<link href="/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet">'
  . '</head>'
  . '<body>'
    . '<div class="container" style="margin-top: 20px;">'
      . '<div class="header clearfix">'
        . '<h3 class="text-muted">Cult of the Treacherous God</h3>'
      . '</div>'
      . '<div class="jumbotron">'
        . '<h1><span class="fa fa-feed"></span> Current Status</h1>'
        . '<table class="table lead">'
          . '<tbody>'
            . '<tr>'
              . '<th>Location</th>'
              . '<td><span class="fa fa-location-arrow"></span> '
                . htmlspecialchars($currentPartyLocation)
              . '</td>'
            . '</tr>'
            . '<tr>'
              . '<th>Party XP</th>'
              . '<td>'
                . '<div class="progress" style="position:relative; height: 40px;">'
                  . '<div class="progress-bar progress-bar-success" role="progressbar" '
                  . 'aria-valuenow="'.ceil($levelProgressPercent).'" aria-valuemin="0" aria-valuemax="100"'
                  . 'style="width:'.ceil($levelProgressPercent).'%">'
                    . '<div style="position:absolute;z-index: 2; top:0; bottom: 0; left: 0; right:0;'
                    . 'line-height:40px; color:#333;font-weight: bold; font-size: 1.5em;">'
                      . htmlspecialchars(number_format($currentPartyXP) . ' (lv. '. $currentPartyLevelName . ')')
                      . ' / '
                      . htmlspecialchars(number_format($nextLevelXP) . ' (lv. '. $nextLevelName . ')')
                    . '</div>'
                    . '<span class="sr-only">'. $levelProgressPercent.'% Complete</span>'
                  . '</div>'
                . '</div>'
                . '<p class="text-muted">'
                  . 'You need to play Approx. '
                  . floor($approxSessionsForLevelUp) .'-'. ceil($approxSessionsForLevelUp)
                  . ' more session to level up'
                . '</p>'
              . '</td>'
            . '</tr>'
            . '<tr>'
              . '<th>Sessions Played</th>'
              . '<td><span class="fa fa-calculator"></span> '
                . htmlspecialchars(
                  $sessionsPlayed
                  . ' + '
                  . $oneShotsPlayed
                  . ' = ' . $totalPlays . ' '
                  . ' (approx '. round($avgXpPerSession, 2) .' xp per session)'
                )
              . '</td>'
            . '</tr>'
            .'<tr>'
              .'<th>DM Kill Counts</th>'
              .'<td>TPK: '. number_format($tpKillCount) .', Players: '. number_format($playerKillCount) .'</td>'
            .'</tr>'
          . '</tbody>'
        . '</table>'
      . '</div>'
    . '</div>'
    . '<script src="/vendor/jquery/jquery.min.js"></script>'
    . '<script src="/vendor/bootstrap/js/bootstrap.min.js"></script>'
  . '</body>'
  . '</html>';

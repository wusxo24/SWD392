import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const weightForStatuteBabyData = {
    Male: {
      Stature: [77, 77.5, 78.5, 79.5, 80.5, 81.5, 82.5, 83.5, 84.5, 85.5, 86.5, 87.5, 88.5, 89.5, 90.5, 91.5, 92.5, 93.5, 94.5, 95.5, 96.5, 97.5, 98.5, 99.5, 100.5, 101.5, 102.5, 103.5, 104.5, 105.5, 106.5, 107.5, 108.5, 109.5, 110.5, 111.5, 112.5, 113.5, 114.5, 115.5, 116.5, 117.5, 118.5, 119.5, 120.5, 121.5
      ],    
      "3th": [8.972918744, 9.073267731, 9.27309208, 9.47192154, 9.669970612, 9.867465098, 10.06464125, 10.26174496, 10.45903091, 10.65676178, 10.85520745, 11.0546442, 11.25535391, 11.45762324, 11.66174286, 11.86800626, 12.07670968, 12.28815023, 12.50262539, 12.72043131, 12.94186266, 13.16720979, 13.39675772, 13.6307828, 13.86955335, 14.11332298, 14.3623275, 14.61678517, 14.8768847, 15.14278742, 15.41461403, 15.69244676, 15.97631447, 16.26619982, 16.56202375, 16.86365693, 17.17091316, 17.48355487, 17.80130995, 18.12386353, 18.45087764, 18.78199002, 19.11682286, 19.45497491, 19.79603451, 20.13956381
      ],
      "5th": [9.11781325, 9.219922075, 9.423242003, 9.625531353, 9.827000834, 10.02787289, 10.22838074, 10.4287674, 10.62928475, 10.83019257, 11.03175764, 11.2342528, 11.43795604, 11.64314963, 11.85011921, 12.05915274, 12.27054003, 12.48457136, 12.70153676, 12.92172471, 13.14542179, 13.37291056, 13.60446875, 13.84036679, 14.08086791, 14.3262235, 14.57667057, 14.83243136, 15.09370466, 15.36066627, 15.63345894, 15.91219242, 16.19693164, 16.48769998, 16.78446659, 17.08715301, 17.39562697, 17.70970539, 18.02916633, 18.35374284, 18.68313795, 19.01702441, 19.35505216, 19.69684281, 20.0420005, 20.3900999
      ],
      "10th": [9.350303042, 9.455148545, 9.663907823, 9.871587899, 10.07839639, 10.28455342, 10.49029047, 10.69584915, 10.90148006, 11.10744159, 11.31399881, 11.52142229, 11.729987, 11.93997121, 12.15165548, 12.36532155, 12.58125142, 12.7997264, 13.02102616, 13.24542786, 13.47320539, 13.70462839, 13.9399615, 14.17946326, 14.42338546, 14.6719715, 14.92545486, 15.18405792, 15.44798851, 15.71743814, 15.99257708, 16.27355169, 16.56047764, 16.85343765, 17.15247356, 17.4575854, 17.76872619, 18.08580073, 18.40866976, 18.73714656, 19.0710044, 19.40997727, 19.75376486, 20.1020308, 20.45440956, 20.81050076
      ],
      "25th": [9.766407722, 9.875875665, 10.09383533, 10.31065794, 10.52655452, 10.7417502, 10.95648264, 11.17100044, 11.38556161, 11.60043192, 11.81588337, 12.03219261, 12.24963938, 12.46850502, 12.68907093, 12.91161745, 13.13642188, 13.36375794, 13.59389429, 13.82709389, 14.06361249, 14.30369892, 14.54759427, 14.79553258, 15.04773906, 15.30443284, 15.56582724, 15.83212792, 16.10353776, 16.38025293, 16.66246685, 16.95036489, 17.24412681, 17.54391749, 17.84988762, 18.16216193, 18.48083577, 18.80596716, 19.13756712, 19.47560008, 19.81997697, 20.17055644, 20.52714418, 20.88949663, 21.25732015, 21.63027567
      ],
      "50th": [10.27440527, 10.38901871, 10.61724901, 10.84432907, 11.07048885, 11.29597453, 11.52104655, 11.74597768, 11.97105103, 12.19655799, 12.4227963, 12.65006791, 12.87867701, 13.10892794, 13.34112314, 13.5755615, 13.81253552, 14.05233041, 14.29522185, 14.54147499, 14.79134177, 15.04506152, 15.30285949, 15.56494815, 15.83152429, 16.10277448, 16.37887678, 16.65999867, 16.94630912, 17.23797444, 17.53517134, 17.83808212, 18.14690821, 18.46185811, 18.78315936, 19.11103983, 19.44572803, 19.78744004, 20.13635563, 20.49262111, 20.85632542, 21.2274989, 21.60610366, 21.9920407, 22.3851382, 22.78516628
      ],
      "75th": [10.83812738, 10.95778248, 11.19612673, 11.43339148, 11.66984493, 11.90577397, 12.14148209, 12.37728721, 12.61351947, 12.85051907, 13.08863398, 13.32821763, 13.56962661, 13.81321822, 14.05934806, 14.30836781, 14.56062192, 14.81644595, 15.07616355, 15.3400845, 15.60850108, 15.88168735, 16.15989645, 16.4433606, 16.73228676, 17.02686105, 17.32724961, 17.63359604, 17.94603443, 18.26468632, 18.58967772, 18.92113785, 19.25922069, 19.60409781, 19.95598136, 20.31510927, 20.68175356, 21.05620975, 21.43876754, 21.8297156, 22.22930525, 22.63774393, 23.05517462, 23.48168087, 23.91726195, 24.36185175
],
      "85th": [11.16689855, 11.289158, 11.53275921, 11.77536897, 12.01728516, 12.25882589, 12.50032738, 12.7421419, 12.98463561, 13.22818647, 13.47318203, 13.72001718, 13.96909189, 14.22080884, 14.47557099, 14.73377926, 14.99582939, 15.2621099, 15.53299897, 15.80886196, 16.09004772, 16.37688676, 16.6696879, 16.96873685, 17.27429143, 17.58658316, 17.90581651, 18.23216547, 18.56578254, 18.90679586, 19.25532299, 19.61147125, 19.97535804, 20.34710882, 20.72688185, 21.11486155, 21.51127205, 21.91637379, 22.3304406, 22.75376667, 23.18663214, 23.62929478, 24.08196605, 24.54481209, 25.01792347, 25.50133046
      ],
      "90th": [11.4011129, 11.52507288, 11.77212488, 12.01827111, 12.26383357, 12.50915553, 12.75459958, 13.00054571, 13.24738933, 13.49553926, 13.74541572, 13.99744832, 14.25207386, 14.50973427, 14.77087425, 15.03593913, 15.30537214, 15.57961215, 15.85909086, 16.14423022, 16.435439, 16.73311035, 17.03761835, 17.34931547, 17.66852815, 17.99555569, 18.33066799, 18.67410169, 19.02606388, 19.38672911, 19.75624737, 20.13474455, 20.52233698, 20.91913269, 21.32525216, 21.74082861, 22.16602327, 22.60102871, 23.04605609, 23.50134403, 23.96713325, 24.44365939, 24.93113135, 25.42972912, 25.93957405, 26.46073804
      ],
      "95th": [11.7668991, 11.8932524, 12.14519668, 12.39640999, 12.6472562, 12.89812222, 13.14941636, 13.40156684, 13.6550202, 13.91023979, 14.1677042, 14.42790576, 14.691349, 14.95854908, 15.23003025, 15.50632408, 15.78796821, 16.07550416, 16.36947582, 16.6704272, 16.97890086, 17.29543503, 17.62056129, 17.95480122, 18.29866436, 18.65264302, 19.01720839, 19.39280771, 19.77985667, 20.1787374, 20.58979116, 21.01331726, 21.44956767, 21.89875002, 22.36102622, 22.83652027, 23.32532325, 23.82750255, 24.34311131, 24.87219375, 25.41479043, 25.97093854, 26.54066898, 27.12400191, 27.72093757, 28.33145034
      ],
      "97th": [12.01728627, 12.14509038, 12.40002986, 12.65438854, 12.90856157, 13.16296835, 13.41805131, 13.6742748, 13.93212398, 14.19210372, 14.45473759, 14.72056689, 14.99014975, 15.26406025, 15.54288768, 15.82723547, 16.11772149, 16.41497639, 16.71964365, 17.03237842, 17.35384839, 17.6847315, 18.02571601, 18.3774979, 18.74078304, 19.11628039, 19.5046992, 19.90675015, 20.32312999, 20.75452347, 21.20158343, 21.66492986, 22.14512329, 22.64266738, 23.15797665, 23.69138309, 24.24311525, 24.81329664, 25.40196582, 26.00905839, 26.63443908, 27.27790257, 27.93919453, 28.61800412, 29.31399641, 30.02679082
      ],
    },
    Female: {
      Stature: [77, 77.5, 78.5, 79.5, 80.5, 81.5, 82.5, 83.5, 84.5, 85.5, 86.5, 87.5, 88.5, 89.5, 90.5, 91.5, 92.5, 93.5, 94.5, 95.5, 96.5, 97.5, 98.5, 99.5, 100.5, 101.5, 102.5, 103.5, 104.5, 105.5, 106.5, 107.5, 108.5, 109.5, 110.5, 111.5, 112.5, 113.5, 114.5, 115.5, 116.5, 117.5, 118.5, 119.5, 120.5, 121.5
      ],    
      "3th": [8.739261615, 8.839167516, 9.038517201, 9.23736905, 9.43587839, 9.634213141, 9.832552217, 10.03108351, 10.23000087, 10.42950375, 10.62979128, 10.83106129, 11.03350713, 11.23731521, 11.44266196, 11.64971679, 11.85863674, 12.06957102, 12.28266198, 12.49805271, 12.71588767, 12.93632124, 13.15952176, 13.38568043, 13.61500935, 13.84775164, 14.08417388, 14.32457385, 14.56927503, 14.81862634, 15.07299942, 15.33278813, 15.59840399, 15.87027673, 16.14885045, 16.43458256, 16.72794483, 17.02941648, 17.33948852, 17.65865664, 17.98742223, 18.32628747, 18.67575115, 19.03630228, 19.4084109, 19.79251446
      ],
      "5th": [8.888586869, 8.990097375, 9.192590101, 9.39448496, 9.595921376, 9.797050683, 9.998035565, 10.19904933, 10.40027462, 10.60190372, 10.80413535, 11.00717426, 11.21122918, 11.41651085, 11.62322932, 11.83159463, 12.04181213, 12.25408376, 12.46860734, 12.68558031, 12.9051993, 13.12766544, 13.35318702, 13.58198599, 13.81429721, 14.05037619, 14.29049454, 14.53494603, 14.78404331, 15.03811803, 15.29751915, 15.56261274, 15.83377861, 16.11141079, 16.39591448, 16.6877053, 16.98720984, 17.29486046, 17.61109835, 17.93636825, 18.27111906, 18.61580027, 18.97085907, 19.33673586, 19.71385824, 20.10263208
      ],
      "10th": [9.128540802, 9.232504092, 9.439808634, 9.646379965, 9.852343066, 10.05783406, 10.26300074, 10.46800322, 10.67301464, 10.87822198, 11.08382637, 11.29004337, 11.49710258, 11.70524667, 11.91472966, 12.12581512, 12.33877299, 12.55387711, 12.77140239, 12.99162337, 13.21481233, 13.44123956, 13.67117381, 13.9048846, 14.14264285, 14.38472456, 14.63141037, 14.88298893, 15.13975644, 15.40201748, 15.67008464, 15.94427872, 16.2249273, 16.5123649, 16.80693136, 17.10897135, 17.41883434, 17.73687191, 18.06343891, 18.39889081, 18.74358385, 19.09787338, 19.46211272, 19.83665164, 20.22183471, 20.61799935
      ],
      "25th": [9.55907995, 9.667046213, 9.882231734, 10.09652511, 10.31005891, 10.52297639, 10.73543239, 10.94759478, 11.15964652, 11.37178607, 11.5842315, 11.79722112, 12.01101528, 12.22589739, 12.44217465, 12.66017439, 12.88024501, 13.10275007, 13.32806438, 13.55656614, 13.78863356, 14.02463766, 14.2649386, 14.50988056, 14.759793, 15.01498669, 15.27575841, 15.54238872, 15.8151455, 16.09428485, 16.38005272, 16.67268526, 16.97241047, 17.27944769, 17.5940083, 17.91629559, 18.24650364, 18.58481884, 18.93141779, 19.28646882, 19.65013122, 20.02255635, 20.40388907, 20.79427025, 21.19384134, 21.6027518
      ],
      "50th": [10.08653219, 10.19868351, 10.42217324, 10.64473659, 10.86657146, 11.08788714, 11.30890397, 11.52985331, 11.75097872, 11.97253416, 12.19478883, 12.41802682, 12.64254963, 12.86867851, 13.09675786, 13.32715202, 13.56025156, 13.79646793, 14.03623165, 14.27998232, 14.5281658, 14.78122196, 15.03957746, 15.30363303, 15.5737634, 15.8503043, 16.1335593, 16.42379037, 16.72122308, 17.02604617, 17.33841369, 17.65844486, 17.98622785, 18.32181829, 18.66524194, 19.01649457, 19.37553957, 19.74231348, 20.11672014, 20.4986363, 20.88790914, 21.28435965, 21.6877854, 22.09796571, 22.51466977, 22.93766971
      ],
      "75th": [10.674144, 10.78999185, 11.02093382, 11.25114165, 11.4809532, 11.71072003, 11.94080449, 12.17157684, 12.40341329, 12.63669132, 12.87179128, 13.10909353, 13.34897889, 13.59182967, 13.83803305, 14.08797892, 14.34206849, 14.6007123, 14.86433237, 15.13335566, 15.40821452, 15.68933564, 15.97713269, 16.2719909, 16.57426445, 16.88425753, 17.20222861, 17.52837462, 17.86283343, 18.20567994, 18.55692603, 18.91651802, 19.28434006, 19.66021061, 20.04388538, 20.43505617, 20.8333469, 21.23832075, 21.64947133, 22.06622967, 22.48795967, 22.91396132, 23.34347238, 23.77567219, 24.20968794, 24.64460473
      ],
      "85th": [11.01794159, 11.13546634, 11.36987072, 11.60377608, 11.837632, 12.07190393, 12.30706872, 12.54361009, 12.78201467, 13.02276601, 13.26634311, 13.51321579, 13.76384274, 14.01867037, 14.27813372, 14.54265433, 14.81264629, 15.08851573, 15.37066369, 15.65948286, 15.95535951, 16.25866615, 16.56975626, 16.88895128, 17.21653714, 17.55274622, 17.89775821, 18.2516835, 18.61456222, 18.98635782, 19.3669544, 19.75615211, 20.15366815, 20.55913174, 20.97208562, 21.39198329, 21.81818429, 22.24995962, 22.6864823, 23.12683271, 23.56999284, 24.01484769, 24.46018471, 24.90469458, 25.34697329, 25.78552592
      ],
      "90th": [11.26334412, 11.38184191, 11.61830668, 11.85449919, 12.09096109, 12.32825177, 12.56694308, 12.80761383, 13.05084457, 13.29721122, 13.54728098, 13.80160677, 14.06072319, 14.32514317, 14.59535621, 14.87182549, 15.15499004, 15.44526407, 15.74303877, 16.04868075, 16.36253385, 16.68491497, 17.01611063, 17.35636782, 17.70589007, 18.06482316, 18.4332529, 18.8111906, 19.1985691, 19.5952351, 20.00094429, 20.41535516, 20.83802746, 21.2684158, 21.7058694, 22.14962753, 22.59881442, 23.05244169, 23.50939939, 23.96845835, 24.42826397, 24.8873352, 25.34406179, 25.79670194, 26.24338024, 26.68208549
      ],
      "95th": [11.64739801, 11.76703846, 12.00603364, 12.24521487, 12.48528658, 12.72697467, 12.97102053, 13.21817476, 13.46919053, 13.72481792, 13.98579574, 14.25284528, 14.52666298, 14.80791321, 15.0972208, 15.39516617, 15.70227723, 16.01902591, 16.34582383, 16.68302101, 17.0309025, 17.38968816, 17.75953058, 18.14051413, 18.5326498, 18.93587281, 19.35003441, 19.77489735, 20.21012731, 20.65528582, 21.10982248, 21.57306793, 22.04422649, 22.5223689, 23.00642737, 23.49518765, 23.98728419, 24.48119347, 24.97522873, 25.46753358, 25.95607618, 26.43864271, 26.91283039, 27.37603973, 27.82546527, 28.25808429
      ],
      "97th": [11.91084201, 12.03099456, 12.27123186, 12.51204563, 12.75426396, 12.99873959, 13.24634405, 13.49796154, 13.75448195, 14.01679695, 14.28578915, 14.56232653, 14.84725316, 15.14137958, 15.44547079, 15.76023982, 16.0863298, 16.42430655, 16.77464616, 17.13773099, 17.51383737, 17.90313512, 18.30568297, 18.72143304, 19.15022213, 19.59178174, 20.04572382, 20.51154925, 20.98863696, 21.47624048, 21.97348019, 22.47933846, 22.99264818, 23.51208703, 24.03616881, 24.56323314, 25.09144275, 25.61876629, 26.14297963, 26.66164921, 27.17212889, 27.67154822, 28.15680318, 28.62454542, 29.07117005, 29.49280125
      ],
    }
    };

const WeightForStatureChart = ({ gender = "Female", data = [] }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const statureValues = weightForStatuteBabyData[gender].Stature.map((Stature) => Stature);
      const percentiles = Object.entries(weightForStatuteBabyData[gender])
        .filter(([key]) => key !== "Stature")
        .reduce((acc, [percentile, values]) => {
          acc[percentile] = values;
          return acc;
        }, {});

      const colors = ["#FFAAAA", "#32CD32", "#FF4500", "#FFD700", "#6495ED"];

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: statureValues,
          datasets: [
            ...Object.entries(percentiles).map(([percentile, values], index) => ({
              label: `${percentile} Percentile`,
              data: values.map((y, i) => ({ x: statureValues[i], y })),
              borderColor: colors[index % colors.length],
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 0,
            })),
            {
              label: "User Data",
              data: data,
              borderColor: "black",
              backgroundColor: "orange",
              pointRadius: 6,
              type: "scatter",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Stature (cm)" },
              ticks: { stepSize: 0.1 },
              min: 77,
              max: 120,
            },
            y: {
              title: { display: true, text: "Weight (kg)" },
              ticks: { stepSize: 0.1 },
              min: 7,
              max: 35,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Stature: ${context.raw.x.toFixed(1)} cm, Weight: ${context.raw.y} kg`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [gender, data]);

  return (
    <div style={{ width: "926px", height: "1098px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default WeightForStatureChart;

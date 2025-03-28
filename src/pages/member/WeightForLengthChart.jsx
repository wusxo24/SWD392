    import React, { useEffect, useRef } from "react";
    import { Chart, registerables } from "chart.js";
      
      Chart.register(...registerables);

      const weightForRecumbentBabyData = {
        Male: {
          length: [45, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5, 76.5, 77.5, 78.5, 79.5, 80.5, 81.5, 82.5, 83.5, 84.5, 85.5, 86.5, 87.5, 88.5, 89.5, 90.5, 91.5, 92.5, 93.5, 94.5, 95.5, 96.5, 97.5, 98.5, 99.5, 100.5, 101.5, 102.5, 103.5
          ],    
          "3th": [1.597028518, 1.702957417, 1.918742401, 2.139283471, 2.364025965, 2.59243106, 2.823966844, 3.058104103, 3.294322225, 3.532109837, 3.770975175, 4.010448329, 4.250088071, 4.489485537, 4.728267233, 4.966096999, 5.202677038, 5.437748497, 5.671089001, 5.902515543, 6.131880558, 6.359068402, 6.583997561, 6.806616368, 7.026901165, 7.244856495, 7.460510099, 7.67391364, 7.885140184, 8.094284811, 8.301459453, 8.506795026, 8.710439238, 8.912555531, 9.113322086, 9.312930869, 9.511586717, 9.709506461, 9.90691806, 10.10405976, 10.30117927, 10.49853295, 10.69638497, 10.89500657, 11.0946752, 11.29567376, 11.49828978, 11.70281463, 11.90954225, 12.1187693, 12.33079298, 12.54591071, 12.76441819, 12.98660961, 13.21277431, 13.44319598, 13.67814897, 13.91789949, 14.16269719, 14.41277633
          ],
          "5th": [1.690593749, 1.792954672, 2.00306056, 2.219514291, 2.441421905, 2.667982282, 2.89846365, 3.132186651, 3.368517223, 3.606859589, 3.846657516, 4.087392272, 4.328584525, 4.569794994, 4.810625098, 5.050717205, 5.289754427, 5.527460202, 5.763595946, 5.997962236, 6.230395557, 6.460765369, 6.688974915, 6.914957848, 7.138676485, 7.360121388, 7.579307642, 7.796274848, 8.011085035, 8.223822595, 8.434590571, 8.643511567, 8.850725924, 9.056390619, 9.260678201, 9.463775754, 9.665883884, 9.867215725, 10.06799596, 10.26845983, 10.46885221, 10.66942663, 10.87044435, 11.07217344, 11.27488782, 11.47886643, 11.68439228, 11.89175157, 12.10123261, 12.31312548, 12.52772045, 12.74530738, 12.9661743, 13.19060724, 13.41888786, 13.65129272, 13.88809057, 14.12954284, 14.37589784, 14.62739094
          ],
          "10th": [1.830303285, 1.928805392, 2.132607345, 2.344442385, 2.563170915, 2.78776291, 3.017289051, 3.250908274, 3.487856107, 3.727435106, 3.969008144, 4.211993219, 4.455860069, 4.700127546, 4.94436155, 5.188173227, 5.431217262, 5.673190232, 5.91382859, 6.152907479, 6.390238592, 6.625668165, 6.859075839, 7.090372671, 7.319499566, 7.54642602, 7.771148283, 7.993688292, 8.214092237, 8.432429492, 8.648791006, 8.863288423, 9.076052776, 9.287233301, 9.496996252, 9.705523721, 9.913012453, 10.11967266, 10.32572684, 10.53140858, 10.73696139, 10.94263752, 11.14869679, 11.35540546, 11.56303507, 11.77186133, 11.98216306, 12.19422113, 12.4083174, 12.62473383, 12.84375146, 13.06564953, 13.29070461, 13.5191898, 13.75137383, 13.98752021, 14.22788616, 14.47272193, 14.722269, 14.97675902
          ],
          "25th": [2.053702326, 2.149314246, 2.34835311, 2.556834051, 2.773593907, 2.997514515, 3.227549277, 3.462735881, 3.702195087, 3.94512977, 4.190815779, 4.43859789, 4.687882702, 4.938133749, 5.188867126, 5.439647821, 5.690086611, 5.939837222, 6.18859526, 6.436093976, 6.682104069, 6.926433317, 7.168922842, 7.409447317, 7.647913807, 7.884259416, 8.118452209, 8.350488663, 8.580393153, 8.808215482, 9.034032141, 9.257942887, 9.480070094, 9.700557381, 9.91956818, 10.13728428, 10.35390433, 10.5696423, 10.78472594, 10.99939524, 11.21390081, 11.42850232, 11.64346692, 11.85906768, 12.07558197, 12.29328999, 12.51247319, 12.73341284, 12.95638887, 13.18167788, 13.40955269, 13.64028082, 13.87412402, 14.11133652, 14.3521657, 14.59685108, 14.8456253, 15.09871195, 15.35632936, 15.61868832
          ],
          "50th": [2.289757735, 2.38617219, 2.587097922, 2.797952593, 3.017679791, 3.245225583, 3.479567767, 3.719739648, 3.964838222, 4.214033476, 4.466562625, 4.721730669, 4.978903744, 5.237504753, 5.497008915, 5.756939907, 6.016866693, 6.276400575, 6.535195541, 6.792942366, 7.049370425, 7.304248994, 7.557381995, 7.808610136, 8.057810266, 8.304892397, 8.549802669, 8.792519752, 9.033054944, 9.271448675, 9.507773605, 9.742129356, 9.974642178, 10.20546331, 10.43476723, 10.66274993, 10.88962699, 11.11563177, 11.34101346, 11.56603512, 11.79097176, 12.01610828, 12.24173753, 12.46815824, 12.69567298, 12.92458613, 13.15520182, 13.38782185, 13.6227442, 13.86025986, 14.10065234, 14.34419522, 14.59115139, 14.84177007, 15.0962879, 15.35492729, 15.61789822, 15.88539464, 16.15760201, 16.43469418
          ],
          "75th": [2.515338948, 2.615766477, 2.824925474, 3.044241159, 3.272646214, 3.509103506, 3.752613117, 4.002224198, 4.257039544, 4.516224426, 4.779002851, 5.044659815, 5.312536448, 5.582026947, 5.85257519, 6.123671792, 6.394851791, 6.66569255, 6.935815081, 7.204878803, 7.472584314, 7.738675499, 8.002934684, 8.26518536, 8.525291839, 8.783156413, 9.038722435, 9.291970609, 9.542918966, 9.791619211, 10.03815952, 10.28265908, 10.52526749, 10.76616287, 11.00554988, 11.24365775, 11.48073815, 11.71706321, 11.95292329, 12.18862496, 12.42448873, 12.66084697, 12.89804158, 13.13642183, 13.37634196, 13.6181589, 13.86222981, 14.10890963, 14.35854899, 14.61149059, 14.86806787, 15.12860179, 15.39339911, 15.66274835, 15.93691963, 16.21616173, 16.50070256, 16.79074422, 17.08646948, 17.38803782
          ],
          "90th": [2.710846705, 2.817044967, 3.038262787, 3.270147404, 3.511467362, 3.761071952, 4.01788174, 4.280884515, 4.549132322, 4.821741654, 5.097890522, 5.376817878, 5.65782066, 5.940251499, 6.22351642, 6.507072866, 6.790428163, 7.073138226, 7.354807872, 7.635088323, 7.9136782, 8.190324128, 8.46481824, 8.736998815, 9.006749431, 9.273996989, 9.53871203, 9.800906186, 10.06063106, 10.31797568, 10.57306631, 10.82606321, 11.07715916, 11.32657755, 11.57457043, 11.8214166, 12.06741962, 12.31290587, 12.55822265, 12.8037362, 13.04982974, 13.29690152, 13.5453628, 13.79563586, 14.04815191, 14.30334895, 14.56166964, 14.82355899, 15.08946216, 15.35982164, 15.63507513, 15.91565257, 16.20197359, 16.494444, 16.79345342, 17.09937174, 17.41254676, 17.73329941, 18.06192364, 18.39868195
          ],
          "95th": [2.824861387, 2.935328776, 3.165635227, 3.407200737, 3.65864093, 3.918675144, 4.18611338, 4.459845507, 4.738836361, 5.022119957, 5.308799266, 5.598043337, 5.889087035, 6.181229894, 6.473835067, 6.766328167, 7.058196003, 7.348985362, 7.638300762, 7.925804423, 8.211213607, 8.494298133, 8.774880112, 9.052831095, 9.328070124, 9.600562566, 9.870316803, 10.13738322, 10.40185184, 10.66385133, 10.92354547, 11.18113275, 11.43684424, 11.69094178, 11.94371638, 12.19548652, 12.44659654, 12.69741505, 12.94833337, 13.19976391, 13.45213869, 13.70590772, 13.96153752, 14.21950956, 14.48031873, 14.74447181, 15.01248591, 15.28488689, 15.5622076, 15.84498667, 16.13376622, 16.42909034, 16.73150285, 17.04154573, 17.35975605, 17.68666374, 18.02278798, 18.36863542, 18.72469422, 19.09143177
          ],
          "97th": [2.89780918, 3.011338317, 3.248240003, 3.49693518, 3.755928383, 4.023835077, 4.299368538, 4.581326217, 4.868585555, 5.160094928, 5.454877316, 5.752026649, 6.050711037, 6.350173518, 6.649732739, 6.94878282, 7.246792315, 7.543302768, 7.837923511, 8.130333399, 8.420274027, 8.707543698, 8.991998822, 9.27354736, 9.552145587, 9.827797569, 10.10054839, 10.37048464, 10.63773097, 10.90245061, 11.16483888, 11.42512564, 11.68357247, 11.94047127, 12.19614287, 12.45093578, 12.70522492, 12.9594104, 13.21391629, 13.46918953, 13.7256987, 13.98393299, 14.24440109, 14.50763019, 14.77416503, 15.044567, 15.31941326, 15.59929608, 15.88482163, 16.17661055, 16.47529604, 16.78152407, 17.09595206, 17.41925008, 17.75209809, 18.09518631, 18.44921206, 18.81488277, 19.19290687, 19.58399633
          ],
        },
        Female: {
          length: [45, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5, 76.5, 77.5, 78.5, 79.5, 80.5, 81.5, 82.5, 83.5, 84.5, 85.5, 86.5, 87.5, 88.5, 89.5, 90.5, 91.5, 92.5, 93.5, 94.5, 95.5, 96.5, 97.5, 98.5, 99.5, 100.5, 101.5, 102.5, 103.5
          ],    
          "3th": [1.61302626, 1.723754478, 1.946460733, 2.170805299, 2.396673878, 2.623845869, 2.852008338, 3.08077988, 3.309743456, 3.538486235, 3.766648425, 3.99394852, 4.22019582, 4.445271101, 4.669110719, 4.891682562, 5.112971092, 5.332968047, 5.551666409, 5.769060531, 5.985144406, 6.199912645, 6.413361985, 6.625492182, 6.836308446, 7.045821054, 7.254047943, 7.461015613, 7.666760352, 7.871329398, 8.07478203, 8.277190538, 8.478641037, 8.679234065, 8.879084281, 9.078322619, 9.277093118, 9.475553729, 9.673874713, 9.872236954, 10.07082987, 10.26984825, 10.46949211, 10.66996042, 10.87145032, 11.07415394, 11.27825609, 11.48393116, 11.69134669, 11.9006578, 12.11201227, 12.32555163, 12.54141939, 12.75976132, 12.98073439, 13.20451042, 13.43128538, 13.66127661, 13.89473275, 14.13192569
          ],
          "5th": [1.69530853, 1.805222631, 2.026496007, 2.249554961, 2.474214132, 2.700266794, 2.92747924, 3.155581427, 3.384266533, 3.613206007, 3.842082114, 4.070613878, 4.298576091, 4.525795306, 4.75214371, 4.977524782, 5.201863101, 5.42509726, 5.64717487, 5.868051772, 6.08769022, 6.306059022, 6.523134146, 6.738899009, 6.953345818, 7.166475096, 7.378297165, 7.588832522, 7.798112411, 8.006179356, 8.213087629, 8.418903651, 8.623706299, 8.82758712, 9.03065003, 9.233012616, 9.434804244, 9.636166759, 9.837253816, 10.03823028, 10.2392715, 10.44056188, 10.64229536, 10.84467191, 11.04789724, 11.25218061, 11.45773296, 11.66476403, 11.87348344, 12.08409573, 12.29680209, 12.51179974, 12.72928607, 12.9494582, 13.17251854, 13.39867734, 13.62815947, 13.86120318, 14.09806774, 14.33902847
          ],
          "10th": [1.824644762, 1.932850514, 2.151303478, 2.37216013, 2.595089193, 2.819827425, 3.046162798, 3.273900839, 3.502832371, 3.732716377, 3.963283111, 4.194251416, 4.425349217, 4.656327074, 4.886964606, 5.117070202, 5.34647836, 5.57504651, 5.80265208, 6.029190763, 6.254574837, 6.478732239, 6.701605945, 6.923153436, 7.143346471, 7.362170518, 7.579624634, 7.795721098, 8.010485082, 8.223954294, 8.436178609, 8.647219687, 8.857150596, 9.066055489, 9.274029292, 9.481177715, 9.68761705, 9.893474476, 10.0988884, 10.30400903, 10.50899902, 10.71403421, 10.9193044, 11.12501362, 11.33138025, 11.53863663, 11.74702786, 11.95681, 12.16824818, 12.38161332, 12.5971797, 12.81522219, 13.03601505, 13.25983009, 13.48693728, 13.71760521, 13.95210374, 14.19070443, 14.43368432, 14.68132531
          ],
          "25th": [2.047707671, 2.151843669, 2.363960397, 2.580564792, 2.80098615, 3.024685576, 3.251250865, 3.480372197, 3.71180166, 3.945306087, 4.180622529, 4.417443974, 4.65542253, 4.894194501, 5.133398784, 5.372695342, 5.611774363, 5.850360248, 6.088213081, 6.325126546, 6.560927184, 6.795472337, 7.028648027, 7.260367355, 7.49056809, 7.719212002, 7.946282454, 8.171783008, 8.395735838, 8.61818018, 8.839170822, 9.05877667, 9.277079452, 9.494172583, 9.710160711, 9.925157686, 10.13928821, 10.35268693, 10.56549933, 10.77788274, 10.9900078, 11.20206069, 11.41424337, 11.62677789, 11.83990685, 12.05389519, 12.26903094, 12.48562589, 12.70401141, 12.92453941, 13.14757603, 13.37349756, 13.60268237, 13.83550775, 14.07234276, 14.31354493, 14.55945515, 14.81039951, 15.06668553, 15.32860703
          ],
          "50th": [2.305396985, 2.403256702, 2.606020484, 2.817114082, 3.035356101, 3.259693318, 3.48922017, 3.723195489, 3.961034945, 4.202270022, 4.446476028, 4.693220151, 4.942029343, 5.192403337, 5.443830096, 5.69581328, 5.947889759, 6.199640267, 6.450695818, 6.700736725, 6.949493534, 7.196744733, 7.442313819, 7.686067039, 7.92790936, 8.167783677, 8.405666621, 8.641566305, 8.875519723, 9.107590221, 9.337865054, 9.566453061, 9.793482492, 10.01909902, 10.24346467, 10.46675386, 10.6891553, 10.91086924, 11.13210717, 11.35309164, 11.57405623, 11.79524697, 12.0169203, 12.23934838, 12.46281861, 12.68763627, 12.9141268, 13.1426393, 13.37354263, 13.60723197, 13.84412275, 14.08464853, 14.32925018, 14.57837334, 14.8324557, 15.09192012, 15.35716167, 15.62854849, 15.90640903, 16.19103966
          ],
          "75th": [2.573066177, 2.662835955, 2.853889995, 3.058703241, 3.275451769, 3.502419401, 3.738025406, 3.980867931, 4.229754129, 4.483693775, 4.741844038, 5.003447846, 5.267777008, 5.534118638, 5.801772695, 6.070070759, 6.33839139, 6.606171625, 6.872915135, 7.138192567, 7.401643498, 7.662974516, 7.921956215, 8.17842062, 8.432256562, 8.683408324, 8.931870645, 9.177685743, 9.420939935, 9.661760324, 9.900311537, 10.13679255, 10.37143354, 10.60449286, 10.83625465, 11.06702353, 11.29712459, 11.52689868, 11.75669976, 11.98689198, 12.21784683, 12.44994139, 12.68355339, 12.91906338, 13.15685175, 13.39729953, 13.64078954, 13.88771008, 14.13845236, 14.39341959, 14.65302443, 14.91769089, 15.1878468, 15.4639243, 15.74634796, 16.03552754, 16.33184172, 16.63563645, 16.94720609, 17.2667985
          ],
          "90th": [2.822211988, 2.90317596, 3.081735239, 3.280280685, 3.496304856, 3.72742595, 3.971395567, 4.2261236, 4.489708217, 4.760455514, 5.036873117, 5.317643817, 5.601587401, 5.887634175, 6.174806785, 6.462216757, 6.749065162, 7.034644746, 7.318342, 7.59963607, 7.878098236, 8.15338936, 8.425256531, 8.693529674, 8.958117069, 9.219002186, 9.47623884, 9.729947188, 9.980309503, 10.22756595, 10.47201035, 10.7139859, 10.95388092, 11.19212443, 11.42918192, 11.66554993, 11.90175234, 12.13833477, 12.37585953, 12.61490029, 12.85603662, 13.0998487, 13.346911, 13.59778826, 13.85303006, 14.1131669, 14.37870706, 14.65013514, 14.92790917, 15.21246325, 15.5042068, 15.80352641, 16.11078394, 16.42631821, 16.7504403, 17.08342993, 17.42552542, 17.77692011, 18.13774777, 18.50808075
          ],
          "95th": [2.974943903, 3.049956403, 3.220172553, 3.414702479, 3.630584823, 3.865029598, 4.115400222, 4.37920066, 4.654076004, 4.937828528, 5.228445091, 5.524112903, 5.823223715, 6.124358847, 6.426273604, 6.72787876, 7.028227249, 7.326504329, 7.622019771, 7.914202723, 8.202595917, 8.486850867, 8.766723181, 9.04206755, 9.312833279, 9.579058661, 9.840866488, 10.09845888, 10.3521122, 10.60217203, 10.84904795, 11.09320847, 11.33517576, 11.57552036, 11.81485555, 12.05383282, 12.29313502, 12.53347134, 12.77557129, 13.02017859, 13.26804494, 13.51992325, 13.77656207, 14.03869722, 14.3070456, 14.5822978, 14.86511095, 15.1561012, 15.45583919, 15.76484189, 16.08356951, 16.41242128, 16.75173457, 17.10178143, 17.46276845, 17.83483458, 18.21805007, 18.61241094, 19.01783635, 19.43416015
          ],
          "97th": [3.075559629, 3.146436315, 3.310892709, 3.502712567, 3.718622563, 3.955569802, 4.210681986, 4.481218409, 4.76453627, 5.058090815, 5.359480791, 5.666497508, 5.977171656, 6.289778737, 6.602835746, 6.91507564, 7.225424353, 7.532980555, 7.836997958, 8.136875366, 8.432144771, 8.722463522, 9.00760766, 9.287464886, 9.562029761, 9.831395513, 10.09574977, 10.35536822, 10.61060874, 10.86190554, 11.10976332, 11.35475136, 11.59749766, 11.83868308, 12.07903468, 12.3193224, 12.56034996, 12.80295084, 13.04798203, 13.29631805, 13.54884494, 13.80645301, 14.07003317, 14.3404656, 14.61861423, 14.90531723, 15.20137719, 15.50754879, 15.82453284, 16.1529576, 16.49337198, 16.84623319, 17.21190355, 17.59063809, 17.9825849, 18.38778042, 18.80615497, 19.23752318, 19.68159413, 20.13795636
          ],
        }
        };
      
      const GrowthChart = ({ gender = "Female",  data = [], title, yLabel }) => {
        const chartRef = useRef(null);
        const chartInstanceRef = useRef(null);
      
        useEffect(() => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }
      
          if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
      
            const lengthValues = weightForRecumbentBabyData[gender].length;
            const percentiles = Object.entries(weightForRecumbentBabyData[gender]).filter(([key]) => key !== "length");
      
            const colors = [
              "#FFAAAA", "#32CD32", "#FF4500", "#FFD700", "#6495ED",
              "#9400D3", "#00CED1", "#DC143C", "#FFA500"
            ];
      
            chartInstanceRef.current = new Chart(ctx, {
              type: "line",
              data: {
                labels: lengthValues, // Ensure proper labels
                datasets: [
                  ...percentiles.map(([percentile, values], index) => ({
                    label: `${percentile} Percentile`,
                    data: values.map((y, i) => ({ x: lengthValues[i], y })), // Ensure correct data mapping
                    borderColor: colors[index % colors.length],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointHitRadius: 15, // Expands the invisible hitbox area
                  })),
                  {
                    label: "User Data",
                    data: data, // Ensure this is correctly defined
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
                    type: "linear",
                    title: { display: true, text: "Length (cm)" },
                    ticks: { stepSize: 0.1 },
                    min: 45,
                    max: 103.5,
                  },
                  y: {
                    title: { display: true, text: yLabel },
                    ticks: { stepSize: 0.1 },
                    min: 0,
                    max: 23,
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Length: ${context.raw.x.toFixed(1)} cm, ${yLabel}: ${context.raw.y}`;
                      },
                    },
                    enabled: true, 
                    animation: { duration: 1000 },
                    caretSize: 10,
                    displayColors: true, 
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
        }, [gender, data, yLabel]);
      
        return (
          <div style={{ width: "926px", height: "1098px" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        );
      };
      
      export const WeightForLengthChart = ({ gender, data }) => {
        return (
        <GrowthChart 
        gender={gender} 
        data={data} 
        title="Weight-for-Length Growth Chart" 
        yLabel="Weight (kg)" 
        />
        )
      };
      
      export default WeightForLengthChart;
      
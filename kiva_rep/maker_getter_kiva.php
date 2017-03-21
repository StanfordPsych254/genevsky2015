<?php
//maker and getter file for Turk experimental assignments
//called when the page loads to get the experimental condition from a file on the langcog server
//or to create such a file if it doesn't exist yet.

//randomly generate 50 integers between 0 and 2949

#sample query string
#if:
#conds= unstructured-12,12;1515-12,12;2424-12,12;3333-12,12
#filename= sm_unstructured_13jan
#then the query string looks like:
#?conds=unstructured-12,12;1515-12,12;2424-12,12;3333-12,12&filename=sm_unstructured_13jan

header('Access-Control-Allow-Origin: *');
// ask for file name with images
// ask for number to populate
if (isset($_GET['filename']) && isset($_GET['conds']) && isset($_GET['filelist'])){
	$filename = $_GET['filename'];
	$filelist = $_GET['filelist'];
	$value = $_GET['conds'];
	$numTrials = $_GET['ntrials'];
	
	$assignment_dir = 'experiment_files/';
	$assignment_files =  scandir($assignment_dir);

	// if the condition file doesn't exist yet, generate a new one using the file list
	if(!in_array($filename.'.txt',$assignment_files)){

		$fid = 'experiment_files/'.$filelist.".txt";
		$fh = fopen($fid, 'r') or die("can't open file");
		$conds = fread($fh, filesize($fid));
		fclose($fh);
		$conds = substr($conds,0,-1);
		$conditions = preg_split("/\\r\\n|\\r|\\n/",$conds);	//file names
		$printString = '';

		foreach ($conditions as $condition){
			$printString = $printString.$condition.','.$value.';';
		}
		//$printString = substr($printString,0,-1);
		//printstring done. check condition value makes sense

			//write a new file with the conds
			$fid = 'experiment_files/'.$filename.".txt";
			$fh = fopen($fid, 'w') or die("can't open file");
			fwrite($fh, $printString);
			fclose($fh);

		$conditions = explode(';',$printString);
		shuffle($conditions); //randomizer
		$conds_array = array();
		$subj_left = array();

		foreach ($conditions as $condition){
			$temp = explode(',',$condition);
			$conds_array[$temp[0]] = $temp[1];
			$subj_left[count($subj_left)] = $temp[1];
		}
		$num = max($subj_left);
		$imgstring='';
		if (count($conds_array) >= 1){
			//and find the lowest valued one
			$cond_array_keys = array_keys($conds_array, $num);	
			$imgs = array_slice($cond_array_keys,1,50);
			foreach ($imgs as $img){
				$imgstring = $imgstring.$img.' ';
			}
			$imgstring = substr($imgstring,0,-1);
			echo $imgstring;
		} else {
			echo 'The resulting condition format is ill-formed';
		}
	} else {
		//if it does exist, read it in 
		$fid = 'experiment_files/'.$filename.".txt";
		$fh = fopen($fid, 'r') or die("can't open file");
		$conds_string = fread($fh, filesize($fid));
		fclose($fh);
		//parse the conds
		$conditions = explode(';',$conds_string);
		shuffle($conditions); //randomizer
		$conds_array = array();
		$subj_left = array();

		foreach ($conditions as $condition){
			$temp = explode(',',$condition);
			$conds_array[$temp[0]] = $temp[1];
			$subj_left[count($subj_left)] = $temp[1];
		}
		$num = max($subj_left);
		$imgstring='';
		if (count($conds_array) >= 1){
			//and find the lowest valued one
			// stable descending sort
			$keys = array_keys($conds_array);
			array_multisort($conds_array, SORT_DESC, range(1,count($conds_array)),$keys);
			//$assoc = array_combine($keys, $conds_array);

			//$cond_array_keys = array_keys($conds_array, $num);	
			//$imgs = array_slice($cond_array_keys,0,$numTrials);
			$imgs = array_slice($keys,0,$numTrials);
			foreach ($imgs as $img){
				$imgstring = $imgstring.$img.' ';
			}
			$imgstring = substr($imgstring,0,-1);
			echo $imgstring;
		} else {
			echo 'The resulting condition format is ill-formed';
		}
	}
}
else{
	
	echo "The necessary parameters are not set";
}
?>

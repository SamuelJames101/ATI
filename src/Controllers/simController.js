export class simController{

  static updateList(req, res) {
    console.log(req.body);
    // console.log("chicken")
    res.sendStatus(200);
  };

  static showSimLoc(req, res){
    console.log("got here");
    res.render('sim');
  };

  
}

            var colors = {
                grey: "#4D4D4D",
                darkGrey: "#383838"
            }

            $(window).resize( function( ) { Signs.resize( ); } );

            var Signs = ( function( ) {

                patternUrl = /url(.*?)/;
                var lastRightY = 20,
                lastLeftY = 30,
                gapBetweenTiles = 20,
                signsSet,
                animating,
                hoverRect,
                maxRadius,
                paperMenu,
                maxPaperHeight;

                var _signsMenu = {
                    post : {
                        attr : function( args ) {
                                   if( args && args.color ) {
                                       if( _signsMenu.postObj.el ) {
                                           _signsMenu.postObj.el.attr({ fill: args.color });
                                       } else {
                                           _signsMenu.postObj.fill = args.color;
                                       }
                                   }
                               }
                           },
                    postObj: null,
                    signs : null, // array of raphael sets.
                    paper : null,
                    gapBetweenTiles: 20,
                    lastLeftY: 0,
                    lastRightY: 0,
                    setHeight : function( ) {
                        
                        var p = _signsMenu.paper,
                            el = _signsMenu.postObj.el;

                        _signsMenu.paper.setSize( $(window).width(), ( $(window).height( ) > maxPaperHeight ? $( window ).height( ) : maxPaperHeight ) );
                        var r =  ( $(window).height( ) > maxPaperHeight ? $( window ).height( ) : maxPaperHeight ) / el.getBBox( ).height;
                        
                        el.transform( "s1," + r + ",0,0" );

                    },
                    show: function( ) {

                            _signsMenu.postObj.show( );
                            _signsMenu.signs.show( );
                            _signsMenu.setHeight( );

                          },
                    init : function( args ) { 

                        _signsMenu.signs = Object.create( arrows );

                        _signsMenu.paper = new Raphael( 0, 0, $(document).width(), $(document).height() );

                        // create and define properties
                        postObj = _signsMenu.postObj = Object.create( post );
                        postObj.width = ( args && args.postWidth ) || 12;
                        postObj.x = ( $(document).width() / 2 ) - ( postObj.width / 2 );
                        postObj.x2 = postObj.x + postObj.width;
                        postObj.height = $(document).height( );
                        //postObj.y = ??;
                        //postObj.y2 = ??;
                        signsSet = _signsMenu.paper.set( );


                    },
                    createMenu: function( ) {
                        
                        var r = 20,
                            animating,
                            arrBBox, 
                            arrow,
                            bbox,
                            gap = 10,
                            inner,
                            outerWidth = 200,
                            search,
                            set,
                            visible,
                            xpath,
                            menuIconOpen,
                            menuIconClose,
                            side;
                        

                        function createSlidingShape( width ) {

                            var xa, ya, 
                                xb, yb, 
                                xc, yc,
                                xd, yd,
                                xe, ye,
                                xf, yf,
                                xg, yg,
                                xh, yh,
                                leftCurve,
                                rightCurve;

                            xa = ( gap + r );
                            ya = ( gap + ( 2 * r ) );
                            xb = 3;
                            yb = ( gap + ( 2 * r ) );
                            xc = 3;
                            yc = gap;
                            xd = ( gap + r );
                            yd = gap;

                            xe = ( gap + r );
                            ye = ( gap + ( 2 * r ) );
                            xf = xe - ( ( yd - ye ) * 0.675 );
                            yf = ( gap + ( 2 * r ) );
                            xg = xe - ( ( yd - ye ) * 0.675 );
                            yg = gap;
                            xh = ( gap + r );
                            yh = gap;

                            rightCurve = createBezier( xa, ya, xb, yb, xc, yc, xd, yd ),

                            xe += width;
                            xf += width;
                            xg += width;
                            xh += width;

                            leftCurve = createBezier( xe, ye, xf, yf, xg, yg, xh, yh );

                            return rightCurve + "L" + xh + " " + yh + leftCurve +  "L" + xa + " " + ya;
                        }

                        menu.paper = new Raphael( 0, 0, 250, 50 );
                        $( menu.paper.canvas ).css( "position", "fixed" );

                        menu.innerShape = menu.paper.circle( ( gap + r ), ( r + gap ), r - 7 );

                        inner = menu.innerShape;
                        bbox = inner.getBBox( );

                        search = $("<input type='text'/>");
                        menu.searchBox = search;

                        inner.attr({ "fill": colors.grey, "stroke-width": "0" });

                        search.css({  
                            "margin-top": "0px",
                            "margin-bottom": "0px",
                            "padding-left": "5px",
                            "padding-right": "5px",
                            "-moz-border-radius": "10px",
                            "border-radius": "10px",
                            "-webkit-border-radius": "10px",
                            "border-width": "0px", 
                            position: "fixed" 
                        })
                        .appendTo( document.body )
                        .css({
                            left: ( bbox.x2 + 10 ), 
                            top: bbox.y + ( ( bbox.height - search.innerHeight( ) ) / 2 ),
                            width: outerWidth - 30 + "px",
                            display: "none" 
                        });
 
                        menuIconOpen = menu.paper.path( shapes.menu );
                        menuIconOpen.attr({ fill: colors.darkGrey, "stroke-width": "0" });

                        // transform moves x and y relative to themselves
                        // x and y of circle refer to top left corner and not centre
                        // to centre it in relation to circle half width and height and add difference to half width of circle
                        arrBBox = menuIconOpen.getBBox( );
                        side = Math.sqrt( ( r * r ) / 2 );
                        menuIconOpen.transform( 
                            "t" +
                            ( ( bbox.x - arrBBox.x ) + ( ( bbox.width / 2 ) - ( arrBBox.width / 2 ) ) ) +
                            " " +
                            ( ( bbox.y - arrBBox.y ) + ( ( bbox.height / 2 ) - ( arrBBox.height / 2 ) ) ) +
                            "s" + ( side / arrBBox.width ) + "," + ( side / arrBBox.height )
                        );

                        menuIconClose = menu.paper.path( shapes.close );
                        menuIconClose.attr({ fill: colors.darkGrey, "stroke-width": "0" });

                        // transform moves x and y relative to themselves
                        // x and y of circle refer to top left corner and not centre
                        // to centre it in relation to circle half width and height and add difference to half width of circle
                        arrBBox = menuIconClose.getBBox( );
                        side = Math.sqrt( ( r * r ) / 2 );
                        menuIconClose.transform( 
                            "t" +
                            ( ( bbox.x - arrBBox.x ) + ( ( bbox.width / 2 ) - ( arrBBox.width / 2 ) ) ) +
                            " " +
                            ( ( bbox.y - arrBBox.y ) + ( ( bbox.height / 2 ) - ( arrBBox.height / 2 ) ) ) +
                            "s" + ( side / arrBBox.width ) + "," + ( side / arrBBox.height )
                        );

                        menuIconClose.animate({ opacity: "0.0" }, 0 );
                        xpath = menu.paper.path( createSlidingShape( 0 ) );
                        xpath.toBack( );
                        xpath.attr({ "fill": "" + colors.darkGrey, "stroke-width":"0" });

                        set = menu.set = menu.paper.set( );
                        set.push( inner );
                        set.push( menuIconOpen );
                        set.push( menuIconClose );
                        set.push( xpath );

                        visible = false;
                        animating = false;
                        var display = _signsMenu.display;

                        set.click( function( ) {
                            if( !animating ) {
                                animating = true;

                                if( !visible ) {

                                    if( menu.search.enabled ) {

                                        xpath.animate({ path: createSlidingShape( outerWidth ) }, 200, "linear", function( ) { 

                                            search.fadeToggle( ); 
                                            search.focus();

                                        });
                                    }

                                    menuIconOpen.animate({ opacity: "0.0" }, 0 );
                                    menuIconClose.animate({ opacity: "1.0" }, 500 );
                                    //arrow.animate({ transform: arrow.attr("transform") + "r180" }, 1000, "bounce", function( ) { animating = false; } );
                                    
                                    animating = false;
                                    $( _signsMenu.paper.canvas ).fadeIn( );
                                    visible = true;
                                    _signsMenu.show( );

                                } else {

                                    menuIconClose.animate({ opacity: "0.0" }, 0 );
                                    menuIconOpen.animate({ opacity: "1.0" }, 500 );
                                    //arrow.animate({ transform: arrow.attr("transform") + "r180" }, 1000, "bounce", function( ) { animating = false; });
                                    animating = false;
                                    $( _signsMenu.paper.canvas).fadeOut( );
                                    visible = false;

                                    if( menu.search.enabled ) {

                                        search.fadeToggle( 200, "linear", function( ) { 

                                            xpath.animate({ path: createSlidingShape( 0 ) }, 200, "linear" );
                                            search.val("");
                                        });
                                    }
                                }
                            }
                        });
                    },
                    createArrow: function ( txt, tileColor, urlOrFunction, icon, placeOnLeft ) {

                    var poleArrowGap = _signsMenu.signs.postGap,
                        tilePadding = _signsMenu.signs.tilePadding,
                        shpWidth,
                        textBBox, 
                        arrowGap, 
                        shpHeight,
                        arrowSign,
                        iconPath,
                        iconHeight,
                        iconWidth,
                        ratio,
                        set,
                        xPoint1,
                        yPoint1,
                        xPoint2,
                        yPoint2,
                        xPoint3,
                        yPoint3,
                        xPoint4,
                        yPoint4,
                        xPoint5,
                        yPoint5,
                        xText, 
                        yText,
                        xIcon,
                        yIcon,
                        newArrow;


                    text = _signsMenu.paper.text( 0, 0, txt );
                    
                    text.attr({ "font-family":"PTSansRegular","font-size":"12" });
                    //text.attr({ "font-family":"Arial","font-size":"16", "font-weight":"600" });
                    textBBox = text.getBBox(  );
                    arrowGap = tilePadding || 10;
                    shpHeight = ( arrowGap * 2 ) + textBBox.height;

                    if ( icon ) { 
                        iconPath = _signsMenu.paper.path( icon );
                        ratio = textBBox.height / iconPath.getBBox( ).height;
                        iconPath.attr({ "fill":"#463E3F", "stroke-width":"0" });
                        iconPath.transform( "S" + ratio + "," + ratio + ",0,0" );
                    }

                    shpWidth = ( textBBox.width + arrowGap + arrowGap ) + ( icon ? iconPath.getBBox( ).width + arrowGap : 0 );
                    placeOnLeft ?  setLeftPoints( ) : setRightPoints( );

                    text.attr({ x:xText, y:yText, "fill": "#ffffff", "cursor": "hand" }).toFront( );
                    text.getBBox( ).width;
                    //arrowSign.placedOnLeft = placeOnLeft;

                    tileColor =  tileColor || "#000000" ;

                    newArrow = Object.create( arrow );
                    newArrow.children.text = text;
                    newArrow.children.arrow = arrowSign;
                    newArrow.children.icon = iconPath;

                    set = _signsMenu.paper.set( );
                    set.push( iconPath );
                    set.push( arrowSign );
                    set.push( text );
                    set.attr({ cursor: "pointer" })
                    newArrow.el = set;


                    arrowSign.attr({ "stroke-width":"2", "cursor": "hand", "fill": tileColor, "stroke-width":"0" });

                    if( typeof urlOrFunction === "function" ) {

                        set.click( function( ) { urlOrFunction( ) });

                    } else if ( typeof urlOrFunction === "string" ) {

                        set.click( function( ) { window.location.href = urlOrFunction; } );
                    }

                    //var currentColor = arrow.attr("fill");


                    var animating = false;
                    /*
                    set.hover( function( ) 
                    {
                            // if a timeout has been set then the hover out function is about to run
                            // cancel it and run on this element's hoverout as this element belongs to the set
                            // if it didn't then it wouldn't have access to the timeout property
                            if( arrow.timeout ) 
                            { 
                                clearTimeout( arrow.timeout );
                                delete arrow.timeout;
                            }
                            else if( !arrow.animating )
                            {
                                arrow.animating = true;
                                text.animate({ transform: "s1.1,1" }, 100 );
                                if( arrow.placedOnLeft ) {
                                    arrow.animate({ transform: "s1.1,1," + arrow.getBBox( ).x2 + "," + arrow.getBBox( ).y2 }, 100 );
                                } else { 
                                    arrow.animate({ transform: "s1.1,1," + arrow.getBBox( ).x + "," + arrow.getBBox( ).y }, 100 );
                                }
                                arrow.fade = true;
                            }
                    },
                    function( ) {
                        if( arrow.animating ) {

                        arrow.timeout = setTimeout( function( ) {
                            arrow.stop()
                            arrow.animate({ transform: "" }, 200 );
                                arrow.animating = false;
                                }, 200, "linear" );
                        }
                    });
                    */

                    if ( icon ) { 
                        iconPath.toFront( );
                        // the original coordinates don't start at 0, 0 so need to deduct x and y values from before any transform was applied.
                        var str = "S" + ratio + "," + ratio + ",0,0" + "T" + ( xIcon - iconPath.getBBox( ).x )  + "," + ( yIcon - iconPath.getBBox( ).y ) ; 
                        iconPath.transform( str );  
                    };

                    signsSet.push( text );

                    if ( iconPath ) { signsSet.push( iconPath ); };

                    function setLeftPoints( ) {

                        xPoint1 = _signsMenu.postObj.x - poleArrowGap;
                        yPoint1 = lastLeftY;
                        xPoint2 = xPoint1 - shpWidth;

                        yPoint2 = yPoint1;
                        xPoint3 = xPoint2 - ( shpHeight * 0.4 );
                        yPoint3 = yPoint1 + ( shpHeight / 2 );
                        xPoint4 = xPoint2;
                        yPoint4 = yPoint2 + shpHeight;
                        xPoint5 = xPoint1;
                        yPoint5 = yPoint4;
                        xText = xPoint1 - ( ( shpWidth - ( icon ? iconPath.getBBox( ).width + arrowGap : 0 ) ) / 2 );
                        yText = yPoint1 + ( shpHeight / 2 );
                        xIcon = xPoint2 + arrowGap; 
                        yIcon = yPoint1 + arrowGap;

                        arrowSign = _signsMenu.paper.path( 
                        "M" + xPoint1 + " " + yPoint1 
                        + "L" + xPoint2 + " " + yPoint2
                        + "L" + xPoint3 + " " + yPoint3
                        + "L" + xPoint4 + " " + yPoint4
                        + "L" + xPoint5 + " " + yPoint5
                        + "Z"
                        ); 

                        lastLeftY = lastLeftY + shpHeight + gapBetweenTiles;
                        if( lastLeftY > lastRightY ) { maxPaperHeight = lastLeftY; };
                    };

                    function setRightPoints( ) {

                        xPoint1 = _signsMenu.postObj.x + _signsMenu.postObj.width + poleArrowGap;
                        yPoint1 = lastRightY;
                        xPoint2 = shpWidth + xPoint1;
                        yPoint2 = yPoint1;
                        xPoint3 = ( shpHeight * 0.4 ) + xPoint2;
                        yPoint3 = yPoint1 + ( shpHeight / 2 );
                        xPoint4 = xPoint2;
                        yPoint4 = yPoint2 + shpHeight;
                        xPoint5 = xPoint1;
                        yPoint5 = yPoint4;
                        xText = xPoint1 + ( ( shpWidth - ( icon ? iconPath.getBBox( ).width +  arrowGap : 0 ) ) / 2 );
                        yText = yPoint1 + ( shpHeight / 2 );
                        xIcon = xPoint1 + text.getBBox( ).width + ( 2 * arrowGap );
                        yIcon = yPoint1 + arrowGap;

                        arrowSign = _signsMenu.paper.path( 
                        "M" + xPoint1 + " " + yPoint1 
                        + "L" + xPoint2 + " " + yPoint2
                        + "L" + xPoint3 + " " + yPoint3
                        + "L" + xPoint4 + " " + yPoint4
                        + "L" + xPoint5 + " " + yPoint5
                        + "Z"
                        ); 


                        lastRightY = lastRightY + shpHeight + gapBetweenTiles;
                        if( lastRightY > lastLeftY ) { maxPaperHeight = lastRightY; };
                    };

                    return newArrow;
                }

                };

                var menu = {
                    search: {
                        enabled: true,
                        curvedCorners: true // TODO: make allowances for browsers that don't support curved corners.
                    },
                    paper : null,
                    outerPath: null,
                    innerShape: null,
                    searchBox: null,
                    menuIcon: null,
                    set: null
                };

                var post = {
                    width: 12,
                    x: 0,
                    x2: 0,
                    y: 0,
                    y2: 0,
                    fill:"#cccccc",
                    strokeWidth: "0",
                    el: null,
                    show: function( ) {

                        if( !this.el ) {
                            this.el = _signsMenu.paper.rect( this.x , 10, this.width, this.height );
                            this.el.attr({ fill: this.fill, "stroke-width": this.strokeWidth });
                        }

                        this.el.show( );
                    }
                };

                var arrow = {
                    text : "",
                    color: null,
                    urlOrFunction: "",
                    iconPathDef: "",
                    onLeft: true,
                    el: null,
                    children: {
                        text: null,
                        arrow: null,
                        icon: null
                    },
                    show: function( ) {

                              if( !this.el ) {
                                  this.el = _signsMenu.createArrow( this.text, this.color, this.urlOrFunction, this.iconPathDef, this.onLeft );
                              }

                              this.el.show( );
                    }
                }

                var arrows = {
                    items : [],
                    gap: 10,
                    postGap: 1,
                    tilePadding: 10,
                    show: function( ) {

                        var len,
                            arrowItems,
                            i;

                        arrowItems = this.items;
                        len = arrowItems.length;

                        for( i = 0; i < len; i += 1 ) {

                                arrowItems[i].show( );
                            }
                        }
                    }

 
                if (typeof Object.create !== 'function') {
                    Object.create = function (o) {
                        function F() {}
                        F.prototype = o;
                        return new F();
                    };
                }

                function createBezier(xa, ya, xb, yb, xc, yc, xd, yd) {

                    var path_parts = [ "M" + xa, ya, "C" + xb, yb, xc, yc, xd, yd ]; 
                    var path_string = path_parts.join(" ");

                    return path_string;
                }

                              //   arrows, //TODO: to take out
                return { 
                    show : _signsMenu.show,
                    menu : _signsMenu.createMenu,
                    resize : _signsMenu.setHeight,
                    post : { 
                        attr: _signsMenu.post.attr
                    },
                    addArrow : function( args ) {
                        var newArrow;

                        if( !args ) return;
                        if( !args.text || typeof args.text !== "string" ) return;
                        if( !args.urlOrFunction || !args) return;
                       
                       
                        newArrow = Object.create( arrow );
                        newArrow.text = args.text;
                        newArrow.color = args.color || "#000"; 
                        newArrow.urlOrFunction = args.urlOrFunction;
                        newArrow.iconPathDef = args.icon || "" ; 
                        newArrow.onLeft = "onLeft" in args ? args.onLeft : true; 

                        _signsMenu.signs.items.push( newArrow );
                   },

                   hide : function( ) {
                               _signsMenu.signs.animate({ opacity: "0"  }, 500 );
                   },
                   enableSearch : function( enable ) {

                       menu.search.enabled = enable;
                    },

                    init : function( ) {

                            // initialise left hand corner menu button
                            _signsMenu.init( );
                            _signsMenu.createMenu( );
                   },
                       /* function( args ) { 

                         var postObj;

                        _signsMenu.paper = new Raphael( 0, 0, $(document).width(), $(document).height() );
                        $( _signsMenu.paper.canvas ).attr( "display", "none" );
                        post = _signsMenu.post = Object.create( post );
                        
                        // create and define properties
                        post.width = ( args && args.postWidth ) || 12;
                        post.x = ( $(document).width() / 2 ) - ( post.width / 2 );
                        post.x2 = post.x + post.width;
                        post.height = $(document).height( );
                        //post.y = ??;
                        //post.y2 = ??;

                        // initialise left hand corner menu button
                        Signs.createMenu( );
                        signsSet = _signsMenu.paper.set( );

                    },*/

                    display : function( ) {
                        var len,
                            items,
                            i;

                        post.el = _signsMenu.paper.rect( post.x , 10, post.width, post.height );
                        post.el.attr({ fill: post.fill, "stroke-width": post.strokeWidth });

                        len = arrows.items.length;
                        items = arrows.items;

                        for( i = 0; i < len; i += 1 ) {
                            createArrow( items[i].text, items[i].color, items[i].urlOrFunction, items[i].iconPathDef, items[i].onLeft ); 
                        }
                    }

                    //createSignPost : function( 
                };

            }( ) );


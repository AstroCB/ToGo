---
title: TO GO
author: Zhiyi Kuang, Cameron Bernhardt, Jonah Langlieb
date: Totally Not Last Minute
color: dark
---

# A Complete Solution for Taking A Trip


## Combining All the APIs
We present a solution which allows the user to choose their start and end locations and interface with

- Google Maps
    * Providing the backend display and geocoding (address to longitude/latitude)
- Spotify
    * Find music for the journey with a geographically relevant playlist
- Uber
    * Allow the user to see the different Uber options and their price points
- Forecast.io (weather API)
    * The API behind forecast.io gives local and hypersensitive weather forecasts. It also gives specialized animated `canvas` icons for a more intuitive UI

# The Spotify Debacle

## Another slide
We wanted location-depended music for our users. 

We first thought we would perform a sentiment analysis on tweets mentioning the location name.
+ But, this gives a response like `happy:0.3` and `angry:0.6` and spotify does not allow that search

### WITH SOME MORE
TESTING

#### and some test8ing
*again*
\note{

A note on my list.

}


# Overlay Tricks

## A slide to show overlay tricks

\only{<1,3>}{This text appears on the first and third versions of the slide, but not the second.}

This uses beamer's highlighting command to \alert{<2>}{draw attention here}, but only on the second slide.

\note{<1>}{

Notes can also have overlay specs. First slide version note.

}

\note{<2>}{

Second.

}

\note{<3>}{

And third. Use \LaTeX\ macros in notes, like \emph{emphasis}.

}

## TeX-LOGO

\begin{textblock}{4}(0,1)
Grid demo UL
\end{textblock}

\begin{textblock}{4}(7,1)
Grid demo UR
\end{textblock}

\begin{textblock}{4}(0,5)
Grid demo LL
\end{textblock}

\begin{textblock}{4}(7,5)
\only<2>{Grid demo LR}
\end{textblock}

\note{<2>}{

To get overlay effects with materials placed using \texttt{textpos}, you have to specify the overlay within the \texttt{textblock} environment.

}

#another section

##testing
 - hello list
 - again
